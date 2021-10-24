import * as React from 'react';
import {DataGrid, useGridSlotComponentProps} from '@mui/x-data-grid';
import { withStyles } from "@material-ui/core";
import CustomizedToolbar from './components/customizedToolbar';
import Chip from '@material-ui/core/Chip';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import {makeStyles} from "@material-ui/styles";
import TablePagination from '@mui/material/TablePagination'

const useStyles = makeStyles({
    grid: {
        display: "flex",
        flexDirection: "column-reverse"
    }
});

function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const PatchDataGrid = withStyles({
    root: {
        minHeight: '32px',
        border: 'none',
        fontFamily: 'GraphikLight,Helvetica Neue,Helvetica,Arial,sans-serif',
        fontSize: "14px",
        color: '#505050',

        '& .MuiDataGrid-viewport': {
            width: 'fit-content',
            maxWidth: 'none!important',
            minWidth: '100%!important'
        },

        '& .MuiDataGrid-viewport, & .MuiDataGrid-renderingZone, & .MuiDataGrid-row': {
            maxHeight: 'fit-content!important',
        },

        '& .MuiDataGrid-renderingZone': {
            transform: 'none!important',
            marginRight: '-16px'
        },

        '& .MuiDataGrid-columnHeaderTitle, & .MuiDataGrid-cell': {
            textOverflow: 'unset',
            whiteSpace: 'normal',
            lineHeight: '1.2!important',
            maxHeight: 'fit-content!important',
            minHeight: 'auto!important',
            height: 'auto',
            display: 'flex',
            '& > div': {
                maxHeight: 'inherit',
                width: '100%',
                whiteSpace: 'initial',
                lineHeight: '1'
            }
        },

        '& .MuiDataGrid-columnHeader > div': {
            height: '100%'
        },

        '& .MuiDataGrid-columnHeaderWrapper': {
            maxHeight: 'none!important',
            flex: '1 0 auto',
        },

        '& .MuiDataGrid-row .MuiDataGrid-columnsContainer': {
            maxHeight: 'none!important'
        },

        '& .MuiDataGrid-columnHeaderTitle': {
            textTransform: 'uppercase',
            color: '#747474',
            fontFamily: 'none!important'
        },

        '& .MuiDataGrid-cell': {
            overflowWrap: 'anywhere',
            padding: '5px 5px',

            '&--textRight div': {
                justifyContent: 'flex-end'
            },

            '& > div': {
                alignSelf: 'stretch',
            }
        },

        '& .MuiDataGrid-footerContainer': {
            display: 'block',
            '& p': {
                margin: '0px',
                fontSize: '14px'
            }
        },
    }

})(DataGrid);

export default function PatchGrid() {
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [loadedRows, setLoadedRows] = React.useState([]);
    const [qptVersion, setQptVersion] = React.useState('');
    const [rows, setRows] = React.useState([]);
    const [selectedReleases, setSelectedReleases] = React.useState([]);
    const [selectedCategories, setSelectedCategories] = React.useState([]);
    const classes = useStyles();

    const columns = [
            {
                field: 'id',
                headerName: 'Patch Id',
                width: 130,
                sortable: false
            },
            {
                field: 'description',
                headerName: 'Description',
                width: 450,
                sortable: false,
                renderCell: (params) => (
                    <>
                     <div>
                         {params.value}<br/><br/>
                         {params.getValue(params.id, 'categories').map(function (category) {
                             return <Chip key={category}
                                          style={{margin: "1px 1px"}}
                                          label={category}
                                          size="small"
                                          variant="outlined"
                                          color={selectedCategories.includes(category) ? 'primary' : 'default'}
                             />
                         })}
                         {params.getValue(params.id, 'replacedWith') && <span>
                             <br/><br/>
                             <Alert variant="outlined"
                                    style={{width: "325px", padding:"0px 5px"}}
                                    severity="warning">
                                   <b>Deprecated!</b>  Use {params.getValue(params.id, 'replacedWith')} instead
                              </Alert>

                             </span>
                         }
                         {params.getValue(params.id, 'deprecated') && <span>
                             <br/><br/>
                             <Alert variant="outlined"
                                    style={{width: "130px", padding:"0px 5px"}}
                                    severity="warning">
                                   <b>Deprecated!</b>
                              </Alert>

                             </span>
                         }
                    </div>
                    </>
                )
            },
            {
                field: 'releases',
                headerName: 'Compatible Releases',
                width: 220,
                sortable: false,
                renderCell: (params) => (
                    <div style={{whiteSpace: "pre-line"}}>
                        {params.value.map(function (release) {
                            return <Chip key={release}
                                         style={{margin: "1px 1px"}}
                                         label={release}
                                         size="small"
                                         variant="outlined"
                                         color={selectedReleases.includes(release) ? 'primary' : 'default'}
                            />
                        })}
                    </div>
                )
            },
        {
            field: 'components',
            headerName: 'Details',
            width: 260,
            sortable: false,
            renderCell: (params) => (
                <div style={{whiteSpace: "pre-line"}}>
                    <span className="smallHeader">Origin:</span><br/>
                    - {params.getValue(params.id, 'origin')}<br/><br/>
                    {params.value.length && <>
                        <span style={{color: '#747474'}}>Affected Components:</span><br/>
                        {params.value.map(function (component) {
                            return '- ' + component + '\n';
                        })}
                    </>
                    }
                    {params.getValue(params.id, 'link') && <>
                        <br/><Link href={params.getValue(params.id, 'link')} target="_blank" variant="body2" underline="none">Steps to reproduce</Link>
                    </>}
                </div>
            )
        },
        ];

    const applyFilters = (filters) => {
        setSelectedReleases(filters['releases']);
        setSelectedCategories(filters['categories']);

        const filteredRows = loadedRows.filter((row) => {
            const hasCategories = filters['categories'].length === 0 ||
                row['categories'].filter(x => filters['categories'].includes(x)).length > 0;

            const hasReleases = filters['releases'].length === 0 ||
                row['releases'].filter(x => filters['releases'].includes(x)).length > 0;

            const hasSearchKeyword = filters['searchKeyword'] === '' ||
                Object.keys(row).some((field) => {
                    return (new RegExp(escapeRegExp(filters['searchKeyword']), 'i')).test(row[field].toString());
                });

            return hasCategories && hasReleases && hasSearchKeyword;
        });

        setRows(filteredRows);
    };

    const getUniqueValues = (items, prop) => {
        let result = [];
        items.forEach(item => {
            result = result.concat(item[prop]);
        });
        result = result.filter(function (value, index, self) {
            return self.indexOf(value) === index;
        }).sort();

        return result;
    };

    function CustomPagination() {
        const { state, apiRef, options } = useGridSlotComponentProps();
        return (
            <div style={{justifyContent:"space-between", display:"flex", alignItems: "center", border:"1px red"}}>
                <Alert variant="outlined"
                       style={{width: "300px", padding:"0px 5px", border:"0px"}}
                       severity="info">
                    magento/quality-patches version {qptVersion}
                </Alert>
                <table className={"MuiTablePagination-root"}><tbody><tr>
                <TablePagination
                    style={{border: "none"}}
                    count={state.pagination.rowCount}
                    page={state.pagination.page}
                    onPageChange={(event, value) => apiRef.current.setPage(value)}
                    rowsPerPage={options.pageSize}
                    rowsPerPageOptions={[100]}
                />
                </tr></tbody></table>
            </div>
        );
    }

    React.useEffect(() => {
        //fetch("https://raw.githubusercontent.com/viktym/react-app/master/dist/patches-info.json")
        fetch("./patches-info.json")
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setLoadedRows(result['patches']);
                    setRows(result['patches']);
                    setQptVersion(result['version']);
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
            <>
                <CustomizedToolbar
                    categories={getUniqueValues(loadedRows, 'categories')}
                    releases={getUniqueValues(loadedRows, 'releases').reverse()}
                    filtersOnChange={applyFilters}
                />
                <div style={{height:'1000px', width: '100%'}}>
                    <PatchDataGrid
                        pagination={true}
                        components={{
                            Pagination: CustomPagination
                        }}
                        className={classes.grid}
                        rows={rows}
                        autoHeight={false}
                        rowHeight={0}
                        pageSize={100}
                        rowsPerPageOptions={[100]}
                        columns={columns}
                        disableColumnMenu
                    />
                </div>
            </>
        );
    }
}
