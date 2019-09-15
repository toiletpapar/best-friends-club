import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { StaticRouter } from 'react-router-dom'
import { Home } from '../../../client/Home/index'

describe('#Home', (): void => {
  it('should render correctly', (): void => {
    const tree = renderer
      .create(
        <StaticRouter>
          <Home />
        </StaticRouter>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})