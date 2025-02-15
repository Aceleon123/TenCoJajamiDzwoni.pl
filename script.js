const serverIP = "nightlycored.cloudnord.net";
const apiURL = `https://api.mcsrvstat.us/2/${serverIP}`;

function formatMotd(rawMotd) {
    if (!rawMotd || rawMotd.length === 0) return "No MOTD available";

    const colorCodes = {
        "0": "black",
        "1": "darkblue",
        "2": "darkgreen",
        "3": "darkaqua",
        "4": "darkred",
        "5": "darkpurple",
        "6": "gold",
        "7": "gray",
        "8": "darkgray",
        "9": "blue",
        "a": "green",
        "b": "aqua",
        "c": "red",
        "d": "lightpurple",
        "e": "yellow",
        "f": "white",
        "l": "font-weight:bold",
        "m": "text-decoration:line-through",
        "n": "text-decoration:underline",
        "o": "font-style:italic",
        "r": "color:inherit;font-weight:normal;text-decoration:none;font-style:normal"
    };

    return rawMotd
        .join(" ") // Połącz linie w jedną
        .replace(/§([0-9a-flmnor])/g, (_, code) => {
            const style = colorCodes[code];
            if (style.includes(":")) {
                return `<span style="${style}">`;
            }
            return `<span style="color:${style}">`;
        })
        + "</span>".repeat((rawMotd.join(" ").match(/§[0-9a-flmnor]/g) || []).length); 
}

async function fetchServerStats() {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        const motdElement = document.getElementById("server-motd");
        if (data.motd && data.motd.raw) {
            motdElement.innerHTML = formatMotd(data.motd.raw);
        } else {
            motdElement.textContent = "No MOTD available";
        }

        if (data.online) {
            document.getElementById("server-status").textContent = "Online";
            document.getElementById("player-count").textContent = data.players.online;

            const playerListContainer = document.getElementById("player-list");
            playerListContainer.innerHTML = "";

            if (data.players.list && data.players.list.length > 0) {
                const sortedPlayers = data.players.list.sort();
                sortedPlayers.forEach((player) => {
                    const playerItem = document.createElement("div");
                    playerItem.textContent = player;
                    playerItem.style.textAlign = "left";
                    playerListContainer.appendChild(playerItem);
                });
            } else {
                playerListContainer.textContent = "None";
            }
        } else {
            document.getElementById("server-status").textContent = "Offline";
            document.getElementById("player-count").textContent = "0";
            document.getElementById("player-list").textContent = "N/A";
        }
    } catch (error) {
        document.getElementById("server-title").textContent = "Error";
        document.getElementById("server-motd").textContent = "Could not load data.";
        document.getElementById("server-status").textContent = "Error";
        document.getElementById("player-count").textContent = "N/A";
        document.getElementById("player-list").textContent = "N/A";
        console.error("Error fetching server stats:", error);
    }
}

document.getElementById("server-title").textContent = "TenCoJajamiDzwoni.pl";
fetchServerStats();

// Odświeżanie statystyk co 3 sekundy
setInterval(fetchServerStats, 3000);
