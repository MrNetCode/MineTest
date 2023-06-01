package dev.mine;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.bukkit.Bukkit;
import org.bukkit.Location;
import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.entity.EntityType;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.potion.PotionEffectType;

import com.comphenix.protocol.PacketType;
import com.comphenix.protocol.ProtocolLibrary;
import com.comphenix.protocol.ProtocolManager;
import com.comphenix.protocol.events.ListenerPriority;
import com.comphenix.protocol.events.PacketAdapter;
import com.comphenix.protocol.events.PacketContainer;
import com.comphenix.protocol.events.PacketEvent;
public class App extends JavaPlugin {

    @Override
    public void onEnable() {

        if (!getDataFolder().exists()) {
            getDataFolder().mkdirs();
        }

        saveDefaultConfig();

        List<Location> hintLocations = new ArrayList<>();

        FileConfiguration config = getConfig();

        ConfigurationSection hintSection = config.getConfigurationSection("hints");
        if (hintSection != null) {
            for (String key : hintSection.getKeys(false)) {
                ConfigurationSection locSection = hintSection.getConfigurationSection(key);
                if (locSection != null) {
                    int x = locSection.getInt("x");
                    int y = locSection.getInt("y");
                    int z = locSection.getInt("z");
                    Location loc = new Location(getServer().getWorlds().get(0), x, y, z);
                    hintLocations.add(loc);
                }
            }
        }

        Bukkit.getLogger().info(hintLocations.toString());

        getLogger().info("Plugin Demo Loaded correctly!");

        getCommand("book").setExecutor(new BookGenerator(this));
        Bukkit.getPluginManager().registerEvents(new BookGenerator(this), this);

        getCommand("setmeta").setExecutor(new SetMetadata(this));
        Bukkit.getPluginManager().registerEvents(new SetMetadata(this), this);

        getCommand("hint").setExecutor(new HintCompass(this, config));
        Bukkit.getPluginManager().registerEvents(new HintCompass(this, config), this);

        ProtocolManager manager = ProtocolLibrary.getProtocolManager();

        manager.addPacketListener(
        new PacketAdapter(this, ListenerPriority.NORMAL,
        PacketType.Play.Server.SPAWN_ENTITY) {
        @Override
        public void onPacketSending(PacketEvent event) {
        PacketContainer packet = event.getPacket();
        getLogger().info(packet.getHandle().toString());
        // Assuming you have a PacketContainer named "packet" that contains a
        // Server.SPAWN_POSITION packet
        // Assume 'packet' is a PacketPlayOutSpawnPosition object
        int entityId = packet.getIntegers().read(0);
        UUID uuid = packet.getUUIDs().read(0);
        EntityType entityType = packet.getEntityTypeModifier().read(0);
        double x = packet.getDoubles().read(0);
        double y = packet.getDoubles().read(1);
        double z = packet.getDoubles().read(2);
        float pitch = packet.getBytes().read(0) * 360.0f / 256.0f;
        float yaw = packet.getBytes().read(1) * 360.0f / 256.0f;
        int data = packet.getIntegers().read(1);
        int velocityX = packet.getIntegers().read(2);
        int velocityY = packet.getIntegers().read(3);
        int velocityZ = packet.getIntegers().read(4);

        // Print field values
        getLogger().info("Entity ID: " + entityId);
        getLogger().info("UUID: " + uuid);
        getLogger().info("Entity Type: " + entityType);
        getLogger().info("X: " + x);
        getLogger().info("Y: " + y);
        getLogger().info("Z: " + z);
        getLogger().info("Pitch: " + pitch);
        getLogger().info("Yaw: " + yaw);
        getLogger().info("Data: " + data);
        getLogger().info("Velocity X: " + velocityX);
        getLogger().info("Velocity Y: " + velocityY);
        getLogger().info("Velocity Z: " + velocityZ);

        }

        });

        manager.addPacketListener(
                new PacketAdapter(this, ListenerPriority.NORMAL, PacketType.Play.Server.ENTITY_EFFECT) {
                    @Override
                    public void onPacketSending(PacketEvent event) {
                        PacketContainer packet = event.getPacket();
                        getLogger().info(packet.getHandle().toString());
                        // Assuming you have a PacketContainer named "packet" that contains a
                        // Server.SPAWN_POSITION packet
                        // Assume 'packet' is a PacketPlayOutSpawnPosition object
                        int entityId = packet.getIntegers().read(0);
                        PotionEffectType effect = packet.getEffectTypes().read(0);
                        int amplifier = packet.getBytes().read(0);
                        int duration = packet.getIntegers().read(1);

                        // Print field values
                        getLogger().info("Entity ID: " + entityId);

                        getLogger().info("Effect Type: " + effect);
                        getLogger().info("Ampifier: " + amplifier);
                        getLogger().info("Duration: " + duration);

                    }

                });
                
    }

}
