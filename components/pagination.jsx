"use client";

import {useRouter, useSearchParams} from 'next/navigation';
import { Pagination } from '@/components/bootstrap';

const PaginationControls = (limit) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const page = searchParams.get('page') ?? '1';
    const maxPage = Math.ceil(limit.count / 5);

    return (
        <Pagination className="justify-content-center mt-2">
            {page > 2 && <Pagination.First onClick={() => {
                router.push(`/?page=1`)
            }}/>}
            {page > 1 && <Pagination.Prev onClick={() => {
                router.push(`/?page=${Number(page) - 1}`)
            }} />}
            <Pagination.Item active>{page}</Pagination.Item>
            {page < maxPage && <Pagination.Next onClick={() => {
                router.push(`/?page=${Number(page) + 1}`)
            }}/>}
            {page < maxPage - 1 && <Pagination.Last onClick={() => {
                router.push(`/?page=${maxPage}`)
            }}/>}
        </Pagination>
    )
}

export default PaginationControls;