import React from "react";
import PropTypes from "prop-types";
import ReactPaginate from "react-paginate";

const Paginate = ({ totalPages, selected, handlePageClick }) => {
  console.log("paginate", totalPages, selected, handlePageClick)
  return (
    <ReactPaginate
      containerClassName="pagination column-footer"
      previousLabel={"<"}
      nextLabel={">"}
      breakLabel={<a href="">...</a>}
      breakClassName={"break-me"}
      pageCount={totalPages}
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      onPageChange={handlePageClick}
      subContainerClassName={"pages pagination"}
      activeClassName={"active"}
      forcePage={selected}
    />
  );
};

Paginate.propTypes = {
  totalPages: PropTypes.number.isRequired,
  selected: PropTypes.any.isRequired,
  handlePageClick: PropTypes.func.isRequired
};

export default Paginate;
