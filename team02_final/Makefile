all : frontend backend

help :
	@echo 'Depends on npm'
	@echo 'Available commands:'
	@echo '    all - install frontend and backend npm packages'
	@echo '    frontend - install frontend npm packages'
	@echo '    backend - install backend npm packages'
	@echo '    clean - remove all installed npm packages'
	@echo

backend :
	@echo 'Installing backend modules'
	@echo
	@echo '---'
	@cd backend; npm install
	@echo
	@echo 'Done!'
	@echo

frontend :
	@echo 'Installing frontend modules'
	@echo
	@echo '---'
	@cd frontend; npm install
	@echo
	@echo 'Done!'
	@echo

clean :
	@echo 'Removing backend modules'
	@echo
	@rm -rf backend/node_modules/*
	@echo
	@echo 'Done!'
	@echo

	@echo 'Removing frontend modules'
	@echo
	@rm -rf frontend/node_modules/*
	@echo
	@echo 'Done!'
	@echo

.PHONY: frontend backend clean help
