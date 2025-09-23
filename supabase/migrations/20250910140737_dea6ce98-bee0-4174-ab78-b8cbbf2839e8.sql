-- Habilitar proteção de senhas vazadas e fortalecer a política de senhas
UPDATE auth.config SET leaked_password_protection = true;