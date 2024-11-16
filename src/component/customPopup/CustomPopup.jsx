import PropTypes from "prop-types";
import "./CustomPopup.css";

export default function CustomPopup({ children, open, closed }) {
  return open ? (
    <div className="popup">
      <div className="popup-inner">
        <div className="close-btn" onClick={() => closed(false)}>
          x
        </div>
        {children}
      </div>
    </div>
  ) : (
    <></>
  );
}

CustomPopup.propTypes = {
  children: PropTypes.any,
  open: PropTypes.bool,
  closed: PropTypes.func.isRequired,
};