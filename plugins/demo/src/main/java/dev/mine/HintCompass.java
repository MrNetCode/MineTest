package dev.mine;

import com.comphenix.protocol.PacketType;
import com.comphenix.protocol.ProtocolLibrary;
import com.comphenix.protocol.ProtocolManager;
import com.comphenix.protocol.events.PacketContainer;
import com.comphenix.protocol.wrappers.BlockPosition;
import com.comphenix.protocol.wrappers.WrappedDataValue;
import com.comphenix.protocol.wrappers.WrappedDataWatcher;
import com.comphenix.protocol.wrappers.WrappedDataWatcher.Registry;
import com.comphenix.protocol.wrappers.WrappedDataWatcher.Serializer;
import com.google.common.collect.Lists;

import org.bukkit.Bukkit;
import org.bukkit.Material;
import org.bukkit.block.Block;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.entity.EntityType;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.block.Action;
import org.bukkit.event.player.PlayerInteractEvent;
import org.bukkit.inventory.EquipmentSlot;
import org.bukkit.inventory.ItemStack;
import org.bukkit.metadata.MetadataValue;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitRunnable;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

public class HintCompass implements CommandExecutor, Listener {
    private FileConfiguration config;


    public final JavaPlugin plugin;

   
    public HintCompass(JavaPlugin plugin, FileConfiguration config) {
        this.plugin = plugin;
        this.config = config;

    }
    


    @Override
    public boolean onCommand(CommandSender sender, Command cmd, String label, String[] args) {
        // Check if the command sender is a player
        if (!(sender instanceof Player)) {
            sender.sendMessage("This command can only be used by players.");
            return true;
        }

        // Get the player who executed the command
        Player player = (Player) sender;

        // Check if the command has the correct number of arguments
        if (args.length != 0) {
            sender.sendMessage("Usage: /hint");
            return true;
        }
        int questionMax = config.getInt("questions");

        Integer closestNumber = 0;
        for (Integer i = 1; i < questionMax + 1; i++) {
            String key = i.toString();
            List<MetadataValue> values = player.getMetadata(key);
            if (values != null && !values.isEmpty()) {
                Bukkit.getLogger().info(key + " Var value is: " + values.get(0).value());
            } else {
                closestNumber = i;
                // Get the hint section from the config based on the closest number
                ConfigurationSection hintsSection = config.getConfigurationSection("hints");
                ConfigurationSection hintSection = hintsSection.getConfigurationSection("hint" + closestNumber);

                // Get the x, y, and z coordinates from the hint section
                int x = hintSection.getInt("x");
                int y = hintSection.getInt("y");
                int z = hintSection.getInt("z");

                Bukkit.getLogger().info("Closest number is: " + closestNumber.toString());

                // Create a new "Set Default Spawn Position" packet container
                ProtocolManager manager = ProtocolLibrary.getProtocolManager();
                PacketContainer packet = new PacketContainer(PacketType.Play.Server.SPAWN_POSITION);

                // Set the block position in the packet
                BlockPosition blockPosition = new BlockPosition(x, y, z);
                packet.getBlockPositionModifier().write(0, blockPosition);

                manager.sendServerPacket(player, packet);

                // Send a confirmation message to the player
                sender.sendMessage("Cassa " + closestNumber + " è stata impostata sulla tua bussola, seguila");
                Bukkit.getLogger().info("Sending spawn packet");

                // Oooooooo! finamente riesco a spawnare uno slime con un effeto di glow
                // ci sono volute 3 ore e 20 schede di FireFox aperte
                // ma finalmente ce l'ho fatta

                // * perfavore aggiungi il numero di ore sprecate
                // * se si dovrebbe mai ripresentare la possibilità di lavorare con questo
                // * codice di nuovo

                // * hoursWasted: 3

                // Create a new packet with the extracted field values
                PacketContainer newPacket = new PacketContainer(PacketType.Play.Server.SPAWN_ENTITY);

                int entityId = 9393324;
                UUID entityUUID = UUID.randomUUID();

                newPacket.getIntegers().write(0, entityId);
                newPacket.getIntegers().write(2, 2); // set the size to 2 (medium)
                newPacket.getUUIDs().write(0, entityUUID);
                newPacket.getEntityTypeModifier().write(0, EntityType.SLIME);
                newPacket.getDoubles().write(0, (double) x + 0.50);
                newPacket.getDoubles().write(1, (double) y);
                newPacket.getDoubles().write(2, (double) z + 0.50);
                newPacket.getBytes().write(0, (byte) (1 * 256.0f / 360.0f));
                newPacket.getBytes().write(1, (byte) (1 * 256.0f / 360.0f));

                // ProtocolLibrary.getProtocolManager().sendServerPacket(player, newPacket);

                PacketContainer packetEffect = manager.createPacket(PacketType.Play.Server.ENTITY_METADATA); // metadata
                                                                                                             // packet
                packetEffect.getIntegers().write(0, newPacket.getIntegers().read(0)); // Set entity id from packet above
                WrappedDataWatcher watcher = new WrappedDataWatcher(); // Create data watcher, the Entity Metadata
                                                                       // packet requires this
                Serializer serializer = Registry.get(Byte.class); // Found this through google, needed for some stupid
                                                                  // reason
                watcher.setEntity(player); // Set the new data watcher's target
                watcher.setObject(0, serializer, (byte) (0x40)); // Set status to glowing, found on protocol page

                final List<WrappedDataValue> wrappedDataValueList = Lists.newArrayList();
                watcher.getWatchableObjects().stream().filter(Objects::nonNull).forEach(entry -> {
                    final WrappedDataWatcher.WrappedDataWatcherObject dataWatcherObject = entry.getWatcherObject();
                    wrappedDataValueList.add(new WrappedDataValue(dataWatcherObject.getIndex(),
                            dataWatcherObject.getSerializer(), entry.getRawValue()));
                });
                packetEffect.getDataValueCollectionModifier().write(0, wrappedDataValueList);

                manager.sendServerPacket(player, newPacket);
                manager.sendServerPacket(player, packetEffect);

                new BukkitRunnable() {
                    @Override
                    public void run() {

                        
                        List<Integer> entityIDList = new ArrayList<>();
                        entityIDList.add(entityId);
                        
                        PacketContainer packet = manager.createPacket(PacketType.Play.Server.ENTITY_DESTROY);
                        packet.getIntLists().write(0, entityIDList);
                        //! SEND THIS PACKET TO CLEAN THE ENTITY AFTER 60 SECONDS
                        // manager.sendServerPacket(player, packet);
                    }
                }.runTaskLater(this.plugin, 1200); // 1200 ticks = 60 seconds

                return true;
            }
        }

        // If no hint is found, it means the player has completed all chests
        sender.sendMessage("Hai Trovato tutte le domande");
        return true;
    }

    @EventHandler
    public void onPlayerInteract(PlayerInteractEvent event) {
        Player player = event.getPlayer();
        ItemStack item = player.getInventory().getItemInMainHand();
        Block clickedBlock = event.getClickedBlock();
        if (event.getAction() == Action.RIGHT_CLICK_BLOCK
                && clickedBlock.getType() == Material.ORANGE_SHULKER_BOX) {
            // If the clicked block is an orange shulker box, do not perform the action
            return;
        }
        if (event.getHand() == EquipmentSlot.HAND && item.getType() == Material.COMPASS && item.hasItemMeta()
                && item.getItemMeta().getDisplayName().equals("Hint")
                && (event.getAction() == Action.RIGHT_CLICK_AIR || event.getAction() == Action.RIGHT_CLICK_BLOCK)) {
            // If the player right-clicked an item and is not interacting with an orange
            // shulker box, perform the action
            // Add your action code here
            player.performCommand("hint");
            return;
        }
    }
}
