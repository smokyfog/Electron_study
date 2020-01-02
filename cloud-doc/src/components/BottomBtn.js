
import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const BottomBtn = ({ text, colorClass, icon, onBtnclick }) => (
  <button 
    type="button"
    className={`btn btn-block no-border ${colorClass}`}
    onClick={ onBtnclick }
  >
    <FontAwesomeIcon
      className="mr-2"
      size="lg"
      icon={ icon }
    />
    { text }
  </button>
)

BottomBtn.propTypes = {
  text: PropTypes.string,
  colorClass: PropTypes.string,
  icon: PropTypes.object.isRequired,
  onBtnclick: PropTypes.func
}

BottomBtn.defaultProps = {
  text: '新建'
}

export default BottomBtn