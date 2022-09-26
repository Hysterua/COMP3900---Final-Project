# Step 1: Build
FROM node:16.15.1
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
#COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --silent

#RUN npm install -g react-scripts@5.0.0

# Step 2: Run
COPY . ./
EXPOSE 3000
#RUN chown -R node /usr/src/app
#USER node
CMD ["npm", "run", "start"]
# CMD ["npm", "update"]
