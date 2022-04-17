import {Pagination} from "react-bootstrap";
import {useEffect, useState} from "react";
import {DEFAULT_AROUND, DEFAULT_BOUNDARIES} from "../../api/OrdersAPI";

export const CustomPagination = (props) => {
    const [pages, setPages] = useState([]);
    const [pageControl, setPageControl] = useState({
        currPage: 1,
        totalPages: props.totalPages
    });

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
    }, [props.totalPages])

    useEffect(() => {
        setPageControl(prevState => {
            return {
                ...prevState,
                totalPages: props.totalPages
            }
        })
    }, [])

    const handleCurrPage = (currPage: number) => {
        setPageControl(prevState => {
            return {
                ...prevState,
                currPage: currPage
            };
        });
        props.onPageChange(pageControl.currPage);
    }

    const handleNextPage = () => {
        if (pageControl.currPage === pageControl.totalPages) return;
        const next = pageControl.currPage + 1;
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
        setPageControl(prevState => {
            return {
                ...prevState,
                currPage: prevState.currPage - 1
            };
        });
        props.onPageChange(pageControl.currPage);
    }

    const handleFirstPage = () => {
        setPageControl(prevState => {
            return {
                ...prevState,
                currPage: 1
            };
        });
        props.onPageChange(pageControl.currPage);
    }

    const handleLastPage = () => {
        if (pageControl.currPage + 1 >= pageControl.totalPages) return;
        setPageControl(prevState => {
            return {
                ...prevState,
                currPage: prevState.totalPages
            };
        });
        props.onPageChange();
    }

    return (
        <>
            <Pagination>
                <Pagination.First onClick={handleFirstPage}/>
                <Pagination.Prev onClick={handlePrevPage}/>
                {pages.map(p => {
                    return (
                        p !== -1 ?
                            <Pagination.Item key={p}
                                             active={p === pageControl.currPage}
                                             onClick={() => handleCurrPage(p)}>
                                {p}
                            </Pagination.Item>:
                            <Pagination.Ellipsis key={p} disabled={true}/>
                    )
                })}
                <Pagination.Next onClick={handleNextPage}/>
                <Pagination.Last onClick={handleLastPage}/>
            </Pagination>
        </>
    )
}