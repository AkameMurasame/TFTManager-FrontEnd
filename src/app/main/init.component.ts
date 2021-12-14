import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BrowserWindow, IpcRenderer } from 'electron';
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
  win: BrowserWindow;
  statusMessage = "Identificando League Client";
  loadingDots = "...";
  loadingDotsInterval;
  appVersion: string;

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
        this.ipc.send('app_version');
        this.ipc.on('app_version', (event, data) => {
          this.appVersion = data.version;
        });
      } catch (e) {
        throw e;
      }
    } else {
      this.isElectron = false;
      console.warn('App not running inside Electron!');

      let role = new Role();
      role.id = 1;

      let user = new User();
      user.username = "4976434";
      user.password = "203027214";
      user.role = role;

      this.authService.login(user).subscribe(login => {
        this.verifyPlayer(this.authService.currentUserValue.user.id, null);
      })
    }
  }

  async ngOnInit() {
    this.loadingDotsInterval = setInterval(() => {
      if (this.loadingDots.length === 3) {
        this.loadingDots = ".";
      } else {
        this.loadingDots += ".";
      }
    }, 300)
    this.ipc.on('lcu-load', (event, data) => {
      this.lcuService.setLcuUrl = `https://${data.username}:${data.password}@${data.address}:${data.port}`.toString();
      setTimeout(() => {
        this.isLcu = true;
      }, 5000);
    });

    await this.verifylolClient();
  }

  init() {
    this.lcuService.getLcuPlayer().subscribe(player => {
      this.verifyUser(player);
    });
  }

  navigateToHomePage() {
    this.loadingDots = "";
    clearInterval(this.loadingDotsInterval)
    setTimeout(() => {
      this.statusMessage = "Tudo Pronto!";
    })

    setTimeout(() => {
      this.router.navigate(['player/dashboard']);
    }, 500)
  }

  verifyPlayer(id: number, player1: Player) {
    this.statusMessage = "Verificando Jogador";
    this.playerService.getPlayerByUserId(id).subscribe(bdplayer => {
      this.player = bdplayer;
      if (!bdplayer) {
        this.riotSummonerService.getTftSummoner(player1.displayName).subscribe(summoner => {
          this.statusMessage = "Coletando dados do Invocador";
          player1.puuid = summoner.puuid;
          this.statusMessage = "Registrando Invocador no TFT Manager";
          this.playerService.registerPlayer(player1).subscribe(newPlayer => {
            this.player = newPlayer;
            const team: Team = {
              name: player1.displayName,
              capitain: player1.accountId,
              teamType: TeamType.SINGLEPLAYER,
            };
            this.verifyRole(this.authService.currentUserValue.user);
            this.teamService.teamRegister(team).subscribe(t => {
              this.changeElectronView();
              this.navigateToHomePage();
            })
          });
        });
      } else {
        if (!bdplayer.puuid) {
          this.verifyRole(this.authService.currentUserValue.user);
          this.statusMessage = "Coletando dados do Invocador";
          this.riotSummonerService.getTftSummoner(bdplayer.displayName).subscribe(summoner => {
            bdplayer.puuid = summoner.puuid;
            this.statusMessage = "Atualizando dados do Invocador";
            this.playerService.updatePlayer(bdplayer).subscribe(player => {
              this.changeElectronView();
              this.navigateToHomePage();
            });
          });
        } else {
          this.verifyRole(this.authService.currentUserValue.user);
          if (!this.isElectron) {
            this.navigateToHomePage();
          }
          if (bdplayer.displayName != this.lcuService.getlcuPlayer.displayName) {
            var player = bdplayer;
            player.displayName = this.lcuService.getlcuPlayer.displayName;
            this.statusMessage = "Atualizando dados do Invocador";
            this.playerService.updatePlayer(player).subscribe(player => {
              this.changeElectronView();
              this.navigateToHomePage();
            });
          } else {
            this.changeElectronView();
            this.navigateToHomePage();
          }
        }
      }
    });
  }

  verifyUser(player: Player) {
    this.statusMessage = "Verificando Usuário"
    this.userService.getUserByName(player.summonerId.toString()).subscribe(user => {
      if (!user) {
        this.userService.getPlayerByNick(player.displayName).subscribe(playerx => {
          if (!playerx) {
            this.userService.userRegister(this.makeUser(player)).subscribe(newUser => {
              this.statusMessage = "Efetuando Login";
              this.authService.login(this.makeUser(player)).subscribe(login => {
                this.verifyPlayer(this.authService.currentUserValue.user.id, player);
              })
            });
          } else {
            this.userService.updateUser(this.makeUser(player), playerx.userId).subscribe(userr => {
              this.statusMessage = "Efetuando Login";
              this.authService.login(this.makeUser(player)).subscribe(login => {
                this.verifyPlayer(this.authService.currentUserValue.user.id, player);
              })
            })
          }
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
    user.password = player.accountId.toString();
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

  private changeElectronView() {
    if(this.isElectron) {
      this.ipc.send('change_view');
    }
  }
}
