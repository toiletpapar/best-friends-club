import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { Home } from '../../../client/Home/index'

describe('#Home', () => {
  it('should render correctly', () => {
    const tree = renderer
      .create(<Home />)
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})