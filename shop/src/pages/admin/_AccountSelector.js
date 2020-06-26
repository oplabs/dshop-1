import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import get from 'lodash/get'

import { useStateValue } from 'data/state'
import useConfig from 'utils/useConfig'

import Caret from 'components/icons/Caret'
import Popover from 'components/Popover'

const ShopsDropdown = ({ onNewShop, forceTitle, superAdmin }) => {
  const [shouldClose, setShouldClose] = useState(0)
  const { config, setActiveShop } = useConfig()
  const [{ admin }] = useStateValue()
  const history = useHistory()
  const shops = get(admin, 'shops', [])

  if (!shops.length || (!config.activeShop && !superAdmin)) {
    return null
  }

  const logo = config.logo ? `${config.dataSrc}${config.logo}` : ''
  const isSVG = logo.match(/.svg$/i) ? 'svg' : ''

  return (
    <Popover
      el="div"
      placement="bottom-start"
      className="shop-title"
      contentClassName="shops-dropdown"
      shouldClose={shouldClose}
      button={
        <>
          {superAdmin ? (
            'Super Admin'
          ) : logo && !forceTitle ? (
            <img src={logo} className={isSVG} />
          ) : (
            config.fullTitle
          )}
          <Caret />
        </>
      }
    >
      <>
        {shops.map((shop) => (
          <div
            className={`shop-el${
              shop.authToken === config.activeShop ? ' selected' : ''
            }`}
            key={shop.id}
            onClick={() => {
              setActiveShop(shop.authToken)
              setShouldClose(shouldClose + 1)
              if (superAdmin) {
                history.push({
                  pathname: `/admin`,
                  state: { scrollToTop: true }
                })
              }
            }}
          >
            <img src="/images/green-checkmark.svg" />
            {shop.name}
          </div>
        ))}
        {admin.role !== 'admin' ? null : (
          <div
            className="shop-el bt"
            onClick={() => {
              setShouldClose(shouldClose + 1)
              setActiveShop()
              history.push({
                pathname: `/super-admin/shops`,
                state: { scrollToTop: true }
              })
            }}
          >
            <img src="/images/green-checkmark.svg" />
            Super Admin
          </div>
        )}
        <div
          className="new-shop-link"
          onClick={() => {
            setShouldClose(shouldClose + 1)
            onNewShop()
          }}
        >
          <div className="add-shop-icon">+</div>
          Add a shop
        </div>
      </>
    </Popover>
  )
}

export default ShopsDropdown

require('react-styl')(`
  .shop-title
    max-width: 14rem
    cursor: pointer
    .icon.icon-caret
      fill: #3b80ee
      margin-left: 0.75rem
    img
      width: 85%

  .shops-dropdown
    position: absolute
    color: #000
    z-index: 1
    min-width: 250px
    border-radius: 10px
    box-shadow: 0 2px 11px 0 rgba(0, 0, 0, 0.2)
    border: solid 1px #cdd7e0
    background-color: #ffffff
    overflow: auto
    max-height: calc(100vh - 5rem)

    padding: 1.5rem

    .new-shop-link
      cursor: pointer
      display: flex
      align-items: center
      font-size: 14px
      color: #3b80ee
      &:not(:first-child)
        border-top: 1px solid #cdd7e0
        padding-top: 1rem
        margin-top: 1rem
      .add-shop-icon
        border: solid 1px #3b80ee
        border-radius: 50%
        height: 18px
        width: 18px
        display: flex
        align-items: center
        justify-content: center
        margin-right: 5px

    .shop-el
      display: flex
      align-items: center
      font-size: 1rem
      cursor: pointer
      &.bt
        border-top: solid 1px #cdd7e0
        padding-top: 0.75rem
      &:not(:last-child)
        margin-bottom: 1rem
      img
        height: 14px
        width: 14px
        object-fit: contain
        margin-right: 10px
      &:not(.selected) img
        visibility: hidden
`)