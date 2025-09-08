.PHONY: setup start

# Run installation and database setup
setup:
	npm install
	npx prisma generate
	npx prisma migrate deploy

# Run the app after setup
start: setup
	npm run dev
