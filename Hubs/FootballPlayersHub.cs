using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace TastTask66bit.Hubs
{
    public class FootballPlayersHub: Hub
    {
        private static Dictionary<string, string> LockedPlayerIds = new Dictionary<string, string>();

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            if(LockedPlayerIds.ContainsKey(Context.ConnectionId))
            {
                await Clients.Group("listPage").SendAsync("lockPlayer", LockedPlayerIds[Context.ConnectionId], 0);
                LockedPlayerIds.Remove(Context.ConnectionId);
            }
        }

        public async Task AddUserToListGroup()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "listPage");
        }

        public async Task AddUserToEditGroup()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "editPage");
        }

        public async Task RemoveUserFromListGroup()
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "listPage");
        }

        public async Task RemoveUserFromEditGroup()
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "editPage");
        }

        public async Task RegisterNewPlayer(string id,string firstName, string secondName, string sex, 
                                            string birthDate, string teamName, string country)
        {
            await Clients.Group("listPage").SendAsync("showNewPlayer",id, firstName, secondName, sex == "0" ? "Мужчина":"Женщина", birthDate, teamName, country);
        }

        public async Task UpdatePlayer(string id, string firstName, string secondName, string sex,
                                            string birthDate, string teamName, string country)
        {
            await Clients.Group("listPage").SendAsync("updatePlayer", id, firstName, secondName, sex == "0" ? "Мужчина" : "Женщина", birthDate, teamName, country);
        }

        public async Task LockPlayerForEdit(string id)
        {
            if(!LockedPlayerIds.ContainsKey(Context.ConnectionId))
            {
                LockedPlayerIds.Add(Context.ConnectionId,id);
            }
            await Clients.Group("listPage").SendAsync("lockPlayer", id,1);
        }

        public async Task UnlockPlayerForEdit(string id)
        {
            if (LockedPlayerIds.ContainsKey(Context.ConnectionId))
            {
                LockedPlayerIds.Remove(Context.ConnectionId);
            }
            await Clients.Group("listPage").SendAsync("lockPlayer", id,0);
        }

        public async Task RequestLockedPlayer()
        {
            await Clients.Caller.SendAsync("reciveLockedPlayers", LockedPlayerIds.ToArray());
        }
    }
}
