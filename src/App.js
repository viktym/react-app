import * as React from 'react';
import { DataGrid} from '@mui/x-data-grid';
import { withStyles } from "@material-ui/core";
import QuickSearchToolbar from './components/quickSearchToolbar';

function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const StyledDataGrid = withStyles({
    root: {
        "& .MuiDataGrid-renderingZone": {
            maxHeight: "none !important"
        },
        "& .MuiDataGrid-cell": {
            lineHeight: "unset !important",
            maxHeight: "none !important",
            whiteSpace: "normal"
        },
        "& .MuiDataGrid-cell--withRenderer": {
            alignItems: "unset !important"
        },

        "& .MuiDataGrid-row": {
            maxHeight: "none !important"
        }
    }
})(DataGrid);

export default function QuickFilteringGrid() {
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [loadedRows, setLoadedRows] = React.useState([]);
    const [rows, setRows] = React.useState([]);
    const [searchText, setSearchText] = React.useState('');

    const columns = [
            {
                field: 'id',
                headerName: 'Patch Id',
                width: 130
            },
            {
                field: 'description',
                headerName: 'Description',
                width: 500,
            },
            {
                field: 'categories',
                headerName: 'Categories',
                width: 130,
                sortable: false,
                renderCell: (params) => (
                    <div style={{whiteSpace: "pre-line"}}>
                        {params.value.join('\n')}
                    </div>
                )
            },
            {
                field: 'releases',
                headerName: 'Compatible Releases',
                width: 220,
                sortable: false,
                renderCell: (params) => (
                    <div style={{whiteSpace: "pre-line"}}>
                        {params.value.join(', ')}
                    </div>
                )
            },
            // {
            //     field: 'details',
            //     headerName: 'Details',
            //     width: 200,
            //     renderCell: (params) => (
            //         <div style={{whiteSpace: "pre-line"}}>
            //             {params.value}
            //         </div>
            //     )
            // }
        ];

    const requestSearch = (searchValue) => {
        setSearchText(searchValue);
        const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
        const filteredRows = loadedRows.filter((row) => {
            return Object.keys(row).some((field) => {
                return searchRegex.test(row[field].toString());
            });
        });
        setRows(filteredRows);
    };

    React.useEffect(() => {
        fetch("/patches.json")
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setLoadedRows(result);
                    setRows(result);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [])

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div style={{ height: 800, width: '100%' }}>
                <StyledDataGrid
                    components={{ Toolbar: QuickSearchToolbar }}
                    rows={rows}
                    autoHeight={false}
                    rowHeight={80}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    columns={columns}
                    componentsProps={{
                        toolbar: {
                            value: searchText,
                            onChange: (event) => requestSearch(event.target.value),
                            clearSearch: () => requestSearch(''),
                        },
                    }}
                />
            </div>
        );
    }
}
