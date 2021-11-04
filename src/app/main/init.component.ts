import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IpcRenderer } from 'electron';
import { SummonerService } from "src/app/@riotApi/index";
import { TeamType } from '../@shared/enum/teamType.enum';
import { Player } from '../@shared/models/player/Player';
import { PlayerConnect } from '../@shared/models/socket/player-connect';
import { Team } from '../@shared/models/team/team';
import { Role } from '../@shared/models/user/Role';
import { User } from '../@shared/models/user/User';
import { AuthenticationService } from '../@shared/services/authentication.service';
import { IpcRenderSService } from '../@shared/services/ipc-render.service';
import { LcuService } from '../@shared/services/lcu.service';
import { OrganizationService } from '../@shared/services/organization.service';
import { PlayerService } from '../@shared/services/player.service';
import { TeamService } from '../@shared/services/team.service';
import { UserService } from '../@shared/services/user.service';
import { WebsocketService } from '../@shared/services/websocket.service';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit {

  isLcu: boolean = false;
  enable: boolean = false;
  player: Player;
  ipc: IpcRenderer;
  isElectron: boolean = true;

  constructor(private userService: UserService,
    private authService: AuthenticationService,
    private lcuService: LcuService,
    private jwtService: JwtHelperService,
    private playerService: PlayerService,
    private router: Router,
    private riotSummonerService: SummonerService,
    private organizationService: OrganizationService,
    private teamService: TeamService,
    private webSocketService: WebsocketService,
    private ipcService: IpcRenderSService) {
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
      this.isElectron = false;
      console.warn('App not running inside Electron!');

      let role = new Role();
      role.id = 1;

      let user = new User();
      user.username = "14562429";
      user.password = "14562429";
      user.role = role;

      this.authService.login(user).subscribe(login => {
        this.verifyPlayer(this.authService.currentUserValue.user.id, null);
      })
    }
  }

  async ngOnInit() {
    this.ipc.on('lcu-load', (event, data) => {
      this.lcuService.setLcuUrl = `https://${data.username}:${data.password}@${data.address}:${data.port}`.toString();
      this.isLcu = true;
    });

    await this.verifylolClient();
  }

  init() {
    this.lcuService.getLcuPlayer().subscribe(player => {
      if (this.authService.currentUserValue) {
        if (this.authService.currentUserValue.user.username == player.summonerId.toString()) {
          this.authService.logout();
          this.authService.login(this.makeUser(player)).subscribe(login => {
            this.verifyPlayer(this.authService.currentUserValue.user.id, player);
          })
        } else {
          this.verifyUser(player);
        }
      } else {
        this.verifyUser(player);
      }
    });
  }

  verifyPlayer(id: number, player1: Player) {
    this.playerService.getPlayerByUserId(id).subscribe(bdplayer => {
      this.player = bdplayer;
      if (!bdplayer) {
        this.riotSummonerService.getTftSummoner(player1.displayName).subscribe(summoner => {
          player1.puuid = summoner.puuid;
          this.playerService.registerPlayer(player1).subscribe(newPlayer => {
            this.player = newPlayer;
            const team: Team = {
              name: player1.displayName,
              capitain: player1.accountId,
              teamType: TeamType.SINGLEPLAYER,
            };
            this.verifyRole(this.authService.currentUserValue.user);
            this.teamService.teamRegister(team).subscribe(t => {
              this.router.navigate(['player/dashboard']);
            })
          });
        });
      } else {
        if (!bdplayer.puuid) {
          this.verifyRole(this.authService.currentUserValue.user);
          this.riotSummonerService.getTftSummoner(bdplayer.displayName).subscribe(summoner => {
            console.log(summoner, 103)
            bdplayer.puuid = summoner.puuid;
            this.playerService.updatePlayer(bdplayer).subscribe(player => {
              this.router.navigate(['player/dashboard']);
            });
          });
        } else {
          this.verifyRole(this.authService.currentUserValue.user);
          if (!this.isElectron) {
            this.router.navigate(['player/dashboard']);
          }
          if (bdplayer.displayName != this.lcuService.getlcuPlayer.displayName) {
            console.log("update")
            var player = bdplayer;
            player.displayName = this.lcuService.getlcuPlayer.displayName;
            this.playerService.updatePlayer(player).subscribe(player => {
              this.router.navigate(['player/dashboard']);
            });
          } else {
            this.router.navigate(['player/dashboard']);
          }
        }
      }
    });
  }

  verifyUser(player: Player) {
    this.userService.getUserByName(player.summonerId.toString()).subscribe(user => {
      if (!user) {
        this.userService.userRegister(this.makeUser(player)).subscribe(newUser => {
          this.authService.login(this.makeUser(player)).subscribe(login => {
            this.verifyPlayer(this.authService.currentUserValue.user.id, player);
          })
        });
      } else {
        this.authService.login(this.makeUser(player)).subscribe(login => {
          this.verifyPlayer(this.authService.currentUserValue.user.id, player);
        });
      }
    });
  }

  makeUser(player: Player): User {
    let role = new Role();
    role.id = 1;


    let user = new User();
    user.username = player.summonerId.toString();
    user.password = player.summonerId.toString();
    user.role = role;

    return user;
  }

  verifyRole(user: User) {
    let role = user.role;
    if (role.id == 2) {
      this.organizationService.getOrganizationByUserId(user.id).subscribe(organization => {
        if (organization) {
          const playerConnect: PlayerConnect = {
            id: this.playerService.getPlayer.id,
            summonerId: this.playerService.getPlayer.summonerId,
            displayName: this.playerService.getPlayer.displayName,
            organizationId: organization.id
          };

          console.log(playerConnect);

          this.webSocketService.initWebSocket(playerConnect)
        }
      });
    } else {
      const playerConnect: PlayerConnect = {
        id: this.player.id,
        summonerId: this.player.summonerId,
        displayName: this.player.displayName,
        organizationId: null
      };

      console.log(playerConnect);

      this.webSocketService.initWebSocket(playerConnect);
    }
  }

  async verifylolClient() {
    while (this.isLcu == false) {
      await this.delay(1000);
    }

    if (this.isLcu, 3) {
      this.init();
    }
  }

  private delay(ms: number): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });
  }
}
