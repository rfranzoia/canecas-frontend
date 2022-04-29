import { useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";
import "./customPagination.css"

const DEFAULT_AROUND = 1;
const DEFAULT_BOUNDARIES = 1;

export const CustomPagination = (props) => {
    const [pages, setPages] = useState([]);
    const [pageControl, setPageControl] = useState({
        currPage: 1,
        totalPages: props.totalPages
    });

    const handleCurrPage = (currPage: number) => {
        if (currPage === pageControl.currPage) return;
        setPageControl(prevState => {
            return {
                ...prevState,
                currPage: currPage
            };
        });
        props.onPageChange(currPage);
    }

    const handleNextPage = () => {
        if (pageControl.currPage === pageControl.totalPages) return;
        if (props.totalPages === 0) return;
        const next = pageControl.currPage + 1;
        if (next > props.totalPages) return;
        setPageControl(prevState => {
            return {
                ...prevState,
                currPage: next
            };
        });
        props.onPageChange(next);
    }

    const handlePrevPage = () => {
        if (pageControl.currPage === 1) return;
        const previous = pageControl.currPage - 1;
        setPageControl(prevState => {
            return {
                ...prevState,
                currPage: previous
            };
        });
        props.onPageChange(previous);
    }

    const handleFirstPage = () => {
        if (pageControl.currPage === 1) return;
        setPageControl(prevState => {
            return {
                ...prevState,
                currPage: 1
            };
        });
        props.onPageChange(1);
    }

    const handleLastPage = () => {
        if (pageControl.currPage === props.totalPages) return;
        setPageControl(prevState => {
            return {
                ...prevState,
                currPage: props.totalPages
            };
        });
        props.onPageChange(props.totalPages);
    }

    useEffect(() => {
        setPageControl(prevState => ({
            ...prevState,
            currPage: props.currPage,
        }))
    }, [props.currPage]);

    useEffect(() => {
        const start = DEFAULT_BOUNDARIES;
        const end = props.totalPages - DEFAULT_BOUNDARIES + 1;
        const aroundBefore = pageControl.currPage - DEFAULT_AROUND;
        const aroundAfter = pageControl.currPage + DEFAULT_AROUND;

        let _pages: number[] = [];
        let printDot = false;

        const isTooShort = (end - start) <= 4;
        for (let page = 1; page <= props.totalPages; page++) {
            if (isTooShort) {
                _pages.push(page);

            } else if (page <= start || page >= end || page === pageControl.currPage ||
                (page >= aroundBefore && page <= aroundAfter)) {
                _pages.push(page);
                printDot = true;

            } else if (printDot) {
                _pages.push(-1);
                printDot = false;
            }
        }

        setPages(_pages);
    }, [props.totalPages, pageControl.currPage])

    useEffect(() => {
        setPageControl(prevState => {
            return {
                ...prevState,
                totalPages: props.totalPages
            }
        })
    }, [props.totalPages])

    return (
        <>
            <Pagination>
                <Pagination.First onClick={handleFirstPage}/>
                <Pagination.Prev onClick={handlePrevPage}/>
                {pages.map(page => {
                    return (
                        page !== -1 ?
                            <Pagination.Item key={page}
                                             className="page-item"
                                             active={page === pageControl.currPage}
                                             onClick={() => handleCurrPage(page)}>
                                {page}
                            </Pagination.Item> :
                            <Pagination.Ellipsis key={page} disabled={true}/>
                    )
                })}
                <Pagination.Next onClick={handleNextPage}/>
                <Pagination.Last onClick={handleLastPage}/>
            </Pagination>
        </>
    )
}