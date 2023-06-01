package dev.mine;

import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerEditBookEvent;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.meta.BookMeta;
import org.bukkit.inventory.meta.ItemMeta;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitRunnable;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.Material;

public class BookGenerator implements CommandExecutor, Listener {
    public final JavaPlugin plugin;

    public BookGenerator(JavaPlugin plugin) {
        this.plugin = plugin;
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (command.getName().equalsIgnoreCase("book")) {
            if (args.length >= 3) {
                if (sender instanceof Player) {
                    Player player = (Player) sender;
                    ItemStack book = new ItemStack(Material.WRITABLE_BOOK, 1);
                    BookMeta bookMeta = (BookMeta) book.getItemMeta();
                    bookMeta.setDisplayName(ChatColor.RESET + "Question book");
                    bookMeta.setLore(Arrays.asList(
                            "Question",
                            ChatColor.BLACK + args[0],
                            ChatColor.BLACK + args[1]));

                    StringBuilder sb = new StringBuilder();

                    // iterate through the array starting from index 1
                    for (int i = 2; i < args.length; i++) {
                        sb.append(args[i]);
                        sb.append(" ");
                    }

                    // convert StringBuilder to String and print
                    String result = sb.toString();

                    // Add the text to the first page
                    bookMeta.addPage(result);

                    // Add the question ID tag

                    book.setItemMeta(bookMeta);
                    player.getInventory().addItem(book);
                    player.sendMessage("Generated a question book with ID: " + args[0]);
                } else {
                    sender.sendMessage("This command can only be used by a player.");
                }
            } else {
                sender.sendMessage("Usage: /book <questionId>");
            }
            return true;
        }
        return false;
    }

    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        Player player = event.getPlayer();
        ItemStack compass = new ItemStack(Material.COMPASS);
        ItemMeta meta = compass.getItemMeta();
        meta.setDisplayName("Hint");
        compass.setItemMeta(meta);
        player.getInventory().setItem(0, compass);
    }

    @EventHandler
    public void onBookSign(PlayerEditBookEvent event) {
        if (event.isSigning()) {

            // Send an HTTP request to example.com
            try {
                URL url = new URL("http://172.17.0.1/api/answer?player=" + event.getPlayer().getName() + "&id="
                        + event.getNewBookMeta().getLore().get(1).substring(2) + "&answer="
                        + URLEncoder.encode(event.getNewBookMeta().getPage(1), StandardCharsets.UTF_8) + "&testId="
                        + event.getNewBookMeta().getLore().get(2).substring(2));
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");
                connection.connect();
                int responseCode = connection.getResponseCode();
                if (responseCode == 200) {
                    // Request was successful
                } else {
                    // Request failed
                    Bukkit.getLogger().warning("HTTP request failed with response code " + responseCode);
                }
            } catch (IOException e) {
                // An error occurred while sending the request
                Bukkit.getLogger().warning("An error occurred while sending the HTTP request: " + e.getMessage());
            }

            event.getPlayer().getInventory().remove(Material.WRITTEN_BOOK);
            event.getPlayer().getInventory().remove(Material.WRITABLE_BOOK);

            new BukkitRunnable() {
                @Override
                public void run() {
                    event.getPlayer().getInventory().remove(Material.WRITTEN_BOOK);
                    event.getPlayer().getInventory().remove(Material.WRITABLE_BOOK);
                }
            }.runTaskLater(this.plugin, 4); // 4 ticks = 0.25 seconds
        }

    }

}
