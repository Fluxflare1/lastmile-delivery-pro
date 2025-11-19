import os
import dj_database_url

DATABASES = {
    "default": dj_database_url.parse(
        os.getenv("DATABASE_URL", "postgres://lm_user:lm_pass@postgres:5432/tenant_management"),
        conn_max_age=600,
    )
}
