import * as React from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router'

import { Button, TextInput, Header, Section } from '../common/index'
import { getRandomName, titleCase } from '../../utils/data'

export interface ProfileInformation {
  id: string;
  user: string;
}

export interface Props {
  profile: ProfileInformation;
  onProfileSubmit: (profile: ProfileInformation) => void;
}

type ProfileProps = RouteComponentProps<{}> & Props

const Profile = (props: ProfileProps): JSX.Element => {
  const [profile, setProfile] = React.useState<ProfileInformation>(props.profile)

  const onProfileSubmit = (): void => {
    props.onProfileSubmit(profile)
    props.history.push('/lobby')
  }

  const setRandomName = (): void => {
    setProfile((profile): ProfileInformation => {
      return {
        ...profile,
        user: titleCase(getRandomName()),
      }
    })
  }

  const setUser = (user: string): void => {
    setProfile((profile): ProfileInformation => {
      return {
        ...profile,
        user
      }
    })
  }

  return (
    <React.Fragment>
      <Section>
        <Header>Profile</Header>
        <p>Be who you really want to be.</p>
      </Section>
      <Section>
        <TextInput title='Profile ID: ' value={profile.id} disabled />
      </Section>
      <Section>
        <TextInput title='Display Name: ' value={profile.user} onUpdate={setUser} />
        <Button onClick={setRandomName}>Random!</Button>
      </Section>
      <Section>
        <Button left onClick={(): void => props.history.push('/lobby')}>Cancel</Button>
        <Button onClick={onProfileSubmit}>Save</Button>
      </Section>
    </React.Fragment>
  )
}

export {
  Profile
}
