import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { Home } from '../../../client/Home/index'

describe('#Home', (): void => {
  it('should render correctly', (): void => {
    const tree = renderer
      .create(<Home />)
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})