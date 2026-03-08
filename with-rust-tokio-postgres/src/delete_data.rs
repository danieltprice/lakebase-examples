use tokio_postgres;
use dotenvy::dotenv;
use openssl::ssl::{SslConnector, SslMethod};
use postgres_openssl::MakeTlsConnector;
use with_rust_tokio_postgres::lakebase;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv()?;
    let conn_string = lakebase::get_connection_string().await?;

    let builder = SslConnector::builder(SslMethod::tls())?;
    let connector = MakeTlsConnector::new(builder.build());

    let (client, connection) = tokio_postgres::connect(&conn_string, connector).await?;
    println!("Connection established");

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    // Delete a data row from the table
    let deleted_rows = client.execute(
        "DELETE FROM books WHERE title = $1",
        &[&"1984"],
    ).await?;
    
    if deleted_rows > 0 {
        println!("Deleted the book '1984' from the table.");
    } else {
        println!("'1984' not found in the table.");
    }

    Ok(())
}