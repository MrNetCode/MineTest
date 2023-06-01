FROM openjdk:17-jdk-slim

# update package list and install dependencies
# RUN apt-get update && apt-get install -y openjdk-17-jdk-headless

RUN useradd -ms /bin/bash minecraft
WORKDIR /home/minecraft

# copy the Minecraft server jar file
COPY . .

# expose the Minecraft server port
EXPOSE 25565
EXPOSE 19132

# start the Minecraft server
CMD ["java", "-Xmx1024M", "-Xms1024M", "-jar", "/home/minecraft/paper.jar", "nogui"]
