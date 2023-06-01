package dev.mine;

import java.util.List;

import org.bukkit.Bukkit;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.event.Listener;
import org.bukkit.metadata.FixedMetadataValue;
import org.bukkit.metadata.MetadataValue;
import org.bukkit.plugin.java.JavaPlugin;

public class SetMetadata implements CommandExecutor, Listener {

    public final JavaPlugin plugin;

    public SetMetadata(JavaPlugin plugin) {
        this.plugin = plugin;
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
        if (args.length != 1) {
            sender.sendMessage("Usage: /setmeta <number>");
            return true;
        }

        // Parse the command arguments into doubles

        // Set the RAM stored variables attached to the command sender
        player.setMetadata(args[0], new FixedMetadataValue(this.plugin, "true"));

     
        Integer closestNumber = 0;
        for (Integer i = 1; i < 20; i++) {
            String key = i.toString();
            List<MetadataValue> values = player.getMetadata(key);
            if (values != null && !values.isEmpty()) {
                Bukkit.getLogger().info(key + " Set Value: " + values.get(0).value());
            } else {
                closestNumber = i;
              
                Bukkit.getLogger().info(closestNumber.toString());
            }
        }
        return true;
    }
}
