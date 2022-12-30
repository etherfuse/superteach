/* This example requires Tailwind CSS v2.0+ */
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

const Pagination = ({ paginationData, setPage }) => {
  const { page, pageSize, totalPages, totalCount } = paginationData;

  return (
    <div className="bg-white mt-4 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          className={`${
            page === 1 && " cursor-not-allowed"
          } relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50`}
          disabled={page === 1}
          onClick={() => {
            setPage(page - 1);
          }}
        >
          Anterior
        </button>
        <button
          className={`${
            page === totalPages && " cursor-not-allowed"
          } ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50`}
          disabled={page === totalPages}
          onClick={() => {
            setPage(page + 1);
          }}
        >
          Siguiente
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Página <span className="font-medium">{page}</span> con{" "}
            <span className="font-medium">{pageSize}</span> de{" "}
            <span className="font-medium">{totalCount}</span> resultados
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              className={`${
                page === 1 && " cursor-not-allowed"
              } relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50`}
              disabled={page === 1}
              onClick={() => {
                setPage(page - 1);
              }}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              return (
                <button
                  key={index}
                  aria-current="page"
                  onClick={() => {
                    setPage(index + 1);
                  }}
                  className={`${
                    index + 1 === page
                      ? " bg-indigo-50 border-happy-pink text-happy-pink"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  } bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium`}
                >
                  {index + 1}
                </button>
              );
            })}

            <button
              className={`${
                page === totalPages && " cursor-not-allowed"
              } relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50`}
              disabled={page === totalPages}
              onClick={() => {
                setPage(page + 1);
              }}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
