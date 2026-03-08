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

	// Delete a data row from the table
	_, err = conn.Exec(ctx, "DELETE FROM books WHERE title = $1;", "1984")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Delete failed: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("Deleted the book '1984' from the table.")
}
