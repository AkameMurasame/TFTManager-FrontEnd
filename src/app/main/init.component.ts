import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SummonerService } from "src/app/@riotApi/index";
import { TeamType } from '../@shared/enum/teamType.enum';
import { Player } from '../@shared/models/player/Player';
import { Team } from '../@shared/models/team/team';
import { Role } from '../@shared/models/user/Role';
import { User } from '../@shared/models/user/User';
import { AuthenticationService } from '../@shared/services/authentication.service';
import { LcuService } from '../@shared/services/lcu.service';
import { OrganizationService } from '../@shared/services/organization.service';
import { PlayerService } from '../@shared/services/player.service';
import { TeamService } from '../@shared/services/team.service';
import { UserService } from '../@shared/services/user.service';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit {

  isLcu: String = "";
  enable: boolean = false;

  constructor(private userService: UserService,
    private authService: AuthenticationService,
    private lcuService: LcuService,
    private jwtService: JwtHelperService,
    private playerService: PlayerService,
    private router: Router,
    private riotSummonerService: SummonerService,
    private organizationService: OrganizationService,
    private teamService: TeamService) { }

  async ngOnInit() {
    await this.verifylolClient();
  }

  login() {
    let role = new Role();
    role.id = 1;


    let user = new User();
    //user.username = "4976434";
    //user.password = "4976434";
    user.username = "TFT Akame";
    user.password = "TFT Akame";
    user.role = role;

    this.authService.login(user).subscribe(login => {
      this.verifyRole(this.authService.currentUserValue.user);
      this.verifyPlayer(this.authService.currentUserValue.user.id, null);
    })
  }

  init() {
    this.lcuService.getLcuPlayer().subscribe(player => {
      if (this.authService.currentUserValue) {
        if (this.authService.currentUserValue.user.username == player.summonerId.toString()) {
          this.authService.logout();
          this.authService.login(this.makeUser(player)).subscribe(login => {
            this.verifyRole(this.authService.currentUserValue.user);
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

  verifyPlayer(id: number, player: Player) {
    if (!this.playerService.getPlayer) {
      this.playerService.getPlayerByUserId(id).subscribe(bdplayer => {
        if (!bdplayer) {
          //this.riotSummonerService.getTftSummoner(player.displayName).subscribe(summoner => {
          //player.puuid = summoner.puuid;
          this.playerService.registerPlayer(player).subscribe(newPlayer => {
            const team: Team = {
              name: player.displayName,
              capitain: player.accountId,
              teamType: TeamType.SINGLEPLAYER,
            };

            this.teamService.teamRegister(team).subscribe(t => {
              this.router.navigate(['player/dashboard']);
            })
          });
          //})
        }
        console.log(this.playerService.getPlayer)
        this.router.navigate(['player/dashboard']);
      });
    }
    this.router.navigate(['player/dashboard']);
  }

  verifyUser(player: Player) {
    this.userService.getUserByName(player.summonerId.toString()).subscribe(user => {
      if (!user) {
        this.userService.userRegister(this.makeUser(player)).subscribe(newUser => {
          this.authService.login(this.makeUser(player)).subscribe(login => {
            this.verifyRole(this.authService.currentUserValue.user);
            this.verifyPlayer(this.authService.currentUserValue.user.id, player);
          })
        });
      } else {
        //this.authService.logout();
        this.authService.login(this.makeUser(player)).subscribe(login => {
          this.verifyRole(this.authService.currentUserValue.user);
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
    if (user.role.id == 2) {
      this.organizationService.getOrganizationByUserId(user.id).subscribe(organization => {
        console.log(organization)
      });
    }
  }

  async verifylolClient() {
    while (this.isLcu == "") {
      this.isLcu = this.lcuService.getClientLcu();
      await this.delay(1000);
    }

    if (this.isLcu != "") {
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
