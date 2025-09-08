.PHONY: setup start clean

# Flag for setup completion
SETUP_FLAG=.setup_done

# Run installation and database setup
setup: $(SETUP_FLAG)

$(SETUP_FLAG):
	pnpm install
	npx prisma generate
	npx prisma migrate deploy
	touch $(SETUP_FLAG)

# Run the app after setup
start: setup
	pnpm run dev

# Clean up node modules and setup flag
clean:
	rm -rf node_modules
	rm -f $(SETUP_FLAG)
