import * as React from 'react'
import styled from 'styled-components'
import * as agent from 'superagent'

import { Nav as el } from '../Nav/index'
import { Codenames } from '../Codenames/index'

const Background = styled('div')`
  background-color: ${(props): string => props.theme.lightgray};
  font-family: sans-serif;
  min-height: 100vh;
  height: 100%;
  display: grid;
  grid: 75px 1fr / 1fr
`

const Container = styled('div')`
  padding: ${(props): string => props.theme.pagePadding};
`

const Nav = styled(el)`
  padding: ${(props): string => props.theme.pagePadding};
  margin-bottom: 20px;
`

const useGameID = (): string => {
  const [gameID, setGameID] = React.useState<string | null>(null)

  React.useEffect((): () => void => {
    if (!gameID) {
      agent.post('/codenames').then(({body}): void => {
        setGameID(body.id)
      }).catch((err): void => {
        console.error('Unable to initialize codenames game')
        console.error(err)
      })
    }

    return (): void => {
      if (gameID) {
        agent.delete(`/codenames/${gameID}`).catch((err): void => {
          console.error(`Unable to remove game ${gameID} from server`)
          console.error(err)
        })
      }
    }
  }, [gameID])

  return gameID
}

const Home = (): JSX.Element => {
  const gameID = useGameID()

  return (
    <Background>
      <Nav />
      <Container>
        <Codenames gameID={gameID} />
      </Container>
    </Background>
  )
}

export {
  Home
}
