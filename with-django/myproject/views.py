from django.db import connection
from django.http import HttpResponse


def index(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT version()")
        db_version = cursor.fetchone()[0]
        cursor.execute("SELECT name, applied FROM django_migrations ORDER BY applied DESC")
        migrations = cursor.fetchall()

    rows = "".join(
        f"<tr><td>{name}</td><td>{applied}</td></tr>"
        for name, applied in migrations
    )

    html = f"""
    <html>
    <head>
        <title>Django + Lakebase</title>
        <style>
            body {{ font-family: sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; }}
            table {{ border-collapse: collapse; width: 100%; margin-top: 16px; }}
            th, td {{ border: 1px solid #ddd; padding: 8px 12px; text-align: left; }}
            th {{ background: #f4f4f4; }}
            .badge {{ background: #22c55e; color: white; padding: 2px 10px; border-radius: 12px; font-size: 0.85em; }}
            .explainer {{ background: #f9f9f9; border-left: 4px solid #6366f1; padding: 12px 16px; margin: 24px 0; border-radius: 0 6px 6px 0; }}
            .explainer p {{ margin: 6px 0; }}
            .schema-table td:first-child {{ font-family: monospace; }}
        </style>
    </head>
    <body>
        <h1>Django + Lakebase <span class="badge">Connected</span></h1>
        <p><strong>Database:</strong> {db_version}</p>

        <div class="explainer">
            <p>This demo connects a Django app to a <strong>Databricks Lakebase</strong> Postgres database
            using short-lived rotating credentials — no static passwords.</p>
            <p>When the app started, Django ran <code>migrate</code> which created the tables below
            in your Lakebase instance.</p>
            <p>Ready to build? See <a href="#next-steps">Next Steps</a>.</p>
        </div>

        <h2>Schema created by Django</h2>
        <table class="schema-table">
            <tr><th>Table</th><th>Purpose</th></tr>
            <tr><td>django_migrations</td><td>Tracks which migrations have been applied</td></tr>
            <tr><td>django_content_type</td><td>Tracks installed models</td></tr>
            <tr><td>auth_permission</td><td>Individual permissions</td></tr>
            <tr><td>auth_user</td><td>User accounts</td></tr>
            <tr><td>django_session</td><td>Session storage</td></tr>
        </table>

        <h2>Applied Migrations</h2>
        <p>Live from Lakebase — queried on page load:</p>
        <table>
            <tr><th>Migration</th><th>Applied At</th></tr>
            {rows}
        </table>

        <h2 id="next-steps">Next Steps</h2>
        <table>
            <tr><th>Step</th><th>How</th></tr>
            <tr>
                <td>1. Create a Django app</td>
                <td><code>python manage.py startapp myapp</code></td>
            </tr>
            <tr>
                <td>2. Define models & migrate</td>
                <td><code>python manage.py makemigrations &amp;&amp; python manage.py migrate</code></td>
            </tr>
            <tr>
                <td>3. Use the admin</td>
                <td><code>python manage.py createsuperuser</code>, then visit <a href="/admin">/admin</a></td>
            </tr>
        </table>
    </body>
    </html>
    """
    return HttpResponse(html)
