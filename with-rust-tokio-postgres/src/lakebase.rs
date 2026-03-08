// Fetches short-lived DB token from Databricks and returns a PostgreSQL connection string.
use serde::Deserialize;
use std::env;

#[derive(Deserialize)]
struct OidcResponse {
    access_token: String,
}

#[derive(Deserialize)]
struct CredResponse {
    token: String,
}

pub async fn get_connection_string() -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
    let host = env::var("DATABRICKS_HOST")?;
    let client_id = env::var("DATABRICKS_CLIENT_ID")?;
    let client_secret = env::var("DATABRICKS_CLIENT_SECRET")?;
    let endpoint = env::var("LAKEBASE_ENDPOINT")?;
    let db_host = env::var("LAKEBASE_HOST")?;
    let db_port = env::var("LAKEBASE_PORT").unwrap_or_else(|_| "5432".to_string());
    let db_name = env::var("LAKEBASE_DATABASE").unwrap_or_else(|_| "databricks_postgres".to_string());

    let http = reqwest::Client::new();
    let credentials = base64::engine::general_purpose::STANDARD.encode(format!("{}:{}", client_id, client_secret));

    let oidc_res = http
        .post(format!("https://{}/oidc/v1/token", host))
        .header("Content-Type", "application/x-www-form-urlencoded")
        .header("Authorization", format!("Basic {}", credentials))
        .body("grant_type=client_credentials&scope=all-apis")
        .send()
        .await?
        .json::<OidcResponse>()
        .await?;

    let cred_res = http
        .post(format!("https://{}/api/2.0/postgres/credentials", host))
        .header("Content-Type", "application/json")
        .header("Authorization", format!("Bearer {}", oidc_res.access_token))
        .json(&serde_json::json!({ "endpoint": endpoint }))
        .send()
        .await?
        .json::<CredResponse>()
        .await?;

    let user = urlencoding::encode(&client_id);
    let password = urlencoding::encode(&cred_res.token);
    Ok(format!(
        "postgresql://{}:{}@{}:{}/{}?sslmode=require",
        user, password, db_host, db_port, db_name
    ))
}
