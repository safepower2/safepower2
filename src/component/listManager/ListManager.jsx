import "./ListManager.css";
import downloadIcon from "../../assets/download.png";
import PropTypes from "prop-types";

export default function ListManager({ data, title }) {
  return (
    <div className="list-container">
      {data && data?.length > 0 ? (
        <>
          <h2>{title}</h2>
          {data?.map((item, index) => {
            return (
              <div className="list-item" key={index}>
                <div>{item.name}</div>
                <div>
                  <span onClick={() => {}}>
                    <img src={downloadIcon} width={22} alt="" />
                  </span>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

ListManager.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string.isRequired,
};
