import { Team } from '../../utils/Codenames/CodenamesGame'

const getTeamColours = (props: any): string => {
  if (props.team === Team.UNKNOWN) {
    return props.theme.gray
  } else if (props.team === Team.FIRSTTEAM) {
    return props.theme.red
  } else if (props.team === Team.SECONDTEAM) {
    return props.theme.blue
  } else if (props.team === Team.BYSTANDER) {
    return props.theme.darkgray
  } else if (props.team === Team.ASSASSIN) {
    return props.theme.black
  } else {
    console.warn('Unknown team provided')
  }
}

export {
  getTeamColours
}
