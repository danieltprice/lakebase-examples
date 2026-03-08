use dotenvy::dotenv;
use postgres::Client;
use openssl::ssl::{SslConnector, SslMethod};
use postgres_openssl::MakeTlsConnector;
use with_rust_postgres::lakebase;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv()?;
    let conn_string = lakebase::get_connection_string()?;

    let builder = SslConnector::builder(SslMethod::tls())?;
    let connector = MakeTlsConnector::new(builder.build());

    let mut client = Client::connect(&conn_string, connector)?;
    println!("Connection established");

    // Update a data row in the table
    let updated_rows = client.execute(
        "UPDATE books SET in_stock = $1 WHERE title = $2",
        &[&true, &"Dune"],
    )?;
    
    if updated_rows > 0 {
        println!("Updated stock status for 'Dune'.");
    } else {
        println!("'Dune' not found or stock status already up to date.");
    }
    
    Ok(())
}