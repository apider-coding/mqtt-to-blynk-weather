FROM node:18

RUN cp -r -f /usr/share/zoneinfo/Europe/Stockholm /etc/localtime

# Bundle app source
ADD . /app
WORKDIR /app

# Clean up
RUN rm -rf doc Dockerfile* requirements* .gitignore .git .vscode manifest* README* Readme* mongodb_create_user* .env

# If you are building your code for production
RUN npm ci --only=production

# EXPOSE 8080
CMD [ "node", "app.js" ]
# CMD [ "node", "-r", "./tracing.js", "app.js" ]
