// Package lakebase fetches short-lived DB tokens from Databricks and returns a connection string.
package lakebase

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
)

// GetConnectionString returns a PostgreSQL connection string using a token from the Databricks API.
func GetConnectionString() (string, error) {
	host := os.Getenv("DATABRICKS_HOST")
	clientID := os.Getenv("DATABRICKS_CLIENT_ID")
	clientSecret := os.Getenv("DATABRICKS_CLIENT_SECRET")
	endpoint := os.Getenv("LAKEBASE_ENDPOINT")
	dbHost := os.Getenv("LAKEBASE_HOST")
	dbPort := os.Getenv("LAKEBASE_PORT")
	if dbPort == "" {
		dbPort = "5432"
	}
	dbName := os.Getenv("LAKEBASE_DATABASE")
	if dbName == "" {
		dbName = "databricks_postgres"
	}
	if host == "" || clientID == "" || clientSecret == "" || endpoint == "" || dbHost == "" {
		return "", fmt.Errorf("set DATABRICKS_HOST, DATABRICKS_CLIENT_ID, DATABRICKS_CLIENT_SECRET, LAKEBASE_ENDPOINT, LAKEBASE_HOST")
	}

	creds := base64.StdEncoding.EncodeToString([]byte(clientID + ":" + clientSecret))
	oidcReq, _ := http.NewRequest("POST", "https://"+host+"/oidc/v1/token", bytes.NewBufferString("grant_type=client_credentials&scope=all-apis"))
	oidcReq.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	oidcReq.Header.Set("Authorization", "Basic "+creds)
	oidcRes, err := http.DefaultClient.Do(oidcReq)
	if err != nil {
		return "", err
	}
	defer oidcRes.Body.Close()
	var oidc struct {
		AccessToken string `json:"access_token"`
	}
	if err := json.NewDecoder(oidcRes.Body).Decode(&oidc); err != nil {
		return "", err
	}

	body, _ := json.Marshal(map[string]string{"endpoint": endpoint})
	dbReq, _ := http.NewRequest("POST", "https://"+host+"/api/2.0/postgres/credentials", bytes.NewReader(body))
	dbReq.Header.Set("Content-Type", "application/json")
	dbReq.Header.Set("Authorization", "Bearer "+oidc.AccessToken)
	dbRes, err := http.DefaultClient.Do(dbReq)
	if err != nil {
		return "", err
	}
	defer dbRes.Body.Close()
	var cred struct {
		Token string `json:"token"`
	}
	if err := json.NewDecoder(dbRes.Body).Decode(&cred); err != nil {
		return "", err
	}

	password := url.QueryEscape(cred.Token)
	user := url.QueryEscape(clientID)
	return fmt.Sprintf("postgresql://%s:%s@%s:%s/%s?sslmode=require", user, password, dbHost, dbPort, dbName), nil
}
