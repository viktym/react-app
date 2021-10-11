import * as React from 'react';
import { DataGrid} from '@mui/x-data-grid';
import { withStyles } from "@material-ui/core";
import CustomizedToolbar from './components/customizedToolbar';
import Chip from '@material-ui/core/Chip';
import Alert from '@mui/material/Alert';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import {Button} from "@mui/material";

function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));

const PatchDataGrid = withStyles({
    root: {
        minHeight: '32px',
        border: 'none',
        fontFamily: 'GraphikLight,Helvetica Neue,Helvetica,Arial,sans-serif',
        //fontSize: "14px",
        fontSize: "14px",
        color: '#676056',

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
           // alignItems: 'center',
            //alignSelf: 'stretch',

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
          //  fontWeight: 'bold',
            textTransform: 'uppercase'
        },

        '& .MuiDataGrid-cell': {
            overflowWrap: 'anywhere',
            padding: '5px 5px',
           // margin: '5px 5px',
           // alignItems: 'normal',

            '&--textRight div': {
              //  textAlign: 'right',
                justifyContent: 'flex-end'
            },

            '&:last-of-type > div': {
                //paddingRight: spacing(3)
            },

            '& > div': {
               // padding: '0.75em',
              //  display: 'flex',
                alignSelf: 'stretch',
              //  alignItems: 'center'
            }
        }
    }

})(DataGrid);

export default function PatchGrid() {
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [loadedRows, setLoadedRows] = React.useState([]);
    const [rows, setRows] = React.useState([]);
    const [selectedReleases, setSelectedReleases] = React.useState([]);
    const [selectedCategories, setSelectedCategories] = React.useState([]);

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
                                    style={{width: "300px", padding:"0px 5px"}}
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


                         {/*{params.getValue(params.id, 'releases').map(function (release) {*/}
                         {/*   return <Chip key={release}*/}
                         {/*                style={{margin: "1px 1px"}}*/}
                         {/*                label={release}*/}
                         {/*                size="small"*/}
                         {/*                variant="outlined"*/}
                         {/*                color={selectedReleases.includes(release) ? 'primary' : 'default'}*/}
                         {/*   />*/}
                         {/*})}*/}
                    </div>
                    </>
                )
            },
            // {
            //     field: 'categories',
            //     headerName: 'Categories',
            //     width: 130,
            //     sortable: false,
            //     renderCell: (params) => (
            //         <div style={{whiteSpace: "pre-line"}}>
            //             {params.value.join('\n')}
            //         </div>
            //     )
            // },
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
            field: 'details',
            headerName: 'Details',
            width: 250,
            sortable: false,
            renderCell: (params) => (
                <div style={{whiteSpace: "pre-line"}}>
                    Origin:<br/>
                    - {params.getValue(params.id, 'origin')}<br/>

                    <HtmlTooltip
                        title={
                            <React.Fragment>
                                <div style={{whiteSpace: "pre-line"}}>
                                    {params.value}
                                </div>
                            </React.Fragment>
                        }
                    >
                        <Button>Affected components</Button>
                    </HtmlTooltip>
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
            <div style={{height:'1500px', width: '100%'}}>
                <PatchDataGrid
                    components={{ Toolbar: CustomizedToolbar }}
                    rows={rows}
                    autoHeight={false}
                    rowHeight={0}
                    pageSize={20}
                    rowsPerPageOptions={[20]}
                    columns={columns}
                    componentsProps={{
                        toolbar: {
                            categories: getUniqueValues(loadedRows, 'categories'),
                            releases: getUniqueValues(loadedRows, 'releases').reverse(),
                            filtersOnChange: applyFilters,
                        },
                    }}
                    disableColumnMenu
                />
            </div>
        );
    }
}
