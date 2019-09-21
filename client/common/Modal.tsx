import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

const el = document.createElement('div')
const Overlay = styled('div')`
  position: absolute;
  height: 100vh;
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
`
const ModalContainer = styled('div')`
  border-radius: 8px;
  padding: 10px 50px;
  background-color: white;
  z-index: 1;
`

interface ModalProps {
  onClose: () => void;
  className?: string;
}

const Modal = (props: React.PropsWithChildren<ModalProps>): JSX.Element => {
  React.useEffect((): () => void => {
    document.getElementById('modal-container').appendChild(el)

    return (): void => {
      document.getElementById('modal-container').removeChild(el)
    }
  }, [])

  return ReactDOM.createPortal(
    <Overlay onClick={props.onClose}>
      <ModalContainer
        onClick={(e): void => e.stopPropagation()}
        className={props.className}
      >
        {props.children}
      </ModalContainer>
    </Overlay>,
    el,
  )
}

export {
  Modal,
}