package main

import (
	"context"
	"fmt"
	"os"

	"lakebase-go-quickstart/lakebase"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading .env file: %v\n", err)
		os.Exit(1)
	}

	connString, err := lakebase.GetConnectionString()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Lakebase connection: %v\n", err)
		os.Exit(1)
	}

	ctx := context.Background()
	conn, err := pgx.Connect(ctx, connString)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer conn.Close(ctx)
	fmt.Println("Connection established")

	// Update a data row in the table
	_, err = conn.Exec(ctx, "UPDATE books SET in_stock = $1 WHERE title = $2;", true, "Dune")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Update failed: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Updated stock status for 'Dune'.")
}
