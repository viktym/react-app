import * as React from "react";
import {createTheme} from "@material-ui/core/styles";
import {makeStyles} from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import Button from '@material-ui/core/Button';
import ClearIcon from "@material-ui/icons/Clear";
import Autocomplete from '@mui/material/Autocomplete';
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const defaultTheme = createTheme();
const useStyles = makeStyles(
    (theme) => ({
        root: {
           // padding: theme.spacing(0.5, 0.5, 0),
           // justifyContent: 'space-between',
           // display: 'flex',
           //  alignItems: 'flex-start',
           // flexWrap: 'wrap',
           //  "& .MuiButton-outlinedSizeSmall": {
           //      fontSize: "0.7125rem",
           //      padding: "1px 2px"
           //  },
        },
        textField: {
            // [theme.breakpoints.down('xs')]: {
            //     width: '100%',
            // },
             margin: theme.spacing(1, 0.5, 1.5),
            // '& .MuiSvgIcon-root': {
            //     marginRight: theme.spacing(0.5),
            // },
            // '& .MuiInput-underline:before': {
            //     borderBottom: `1px solid ${theme.palette.divider}`,
            // },
        },
    }),
    { defaultTheme },
);

const StyledButton = withStyles({
    root: {
        textTransform: "none !important",
        margin: "2px 2px",
        "& .MuiButton-outlinedSizeSmall": {
            fontSize: "0.7125rem",
            padding: "1px 2px"
        }
    }
})(Button);

const CustomizedToolbar = props => {
    const classes = useStyles();
    const [selectedCategories, setSelectedCategories] = React.useState(new Set());
    const [selectedReleases, setSelectedReleases] = React.useState(new Set());
    const [searchKeyword, setSearchKeyword] = React.useState('');

    const requestSearch = (searchValue) => {
        setSearchKeyword(searchValue);
        applyFilters({'searchKeyword': searchValue});
    };

    const toggleCategory = id => {
        const set = new Set(selectedCategories);
        if (selectedCategories.has(id)) {
            set.delete(id);
            setSelectedCategories(set);
        } else {
            set.add(id);
            setSelectedCategories(set);
        }
        applyFilters({'categories': [...set]});
    };

    const setReleases = ids => {
        const set = new Set(ids);
        setSelectedReleases(set);
        applyFilters({'releases': [...set]});
    };

    function applyFilters(filters) {
        props.filtersOnChange({
            'categories': 'categories' in filters ? filters['categories'] : [...selectedCategories],
            'releases': 'releases' in filters ? filters['releases'] : [...selectedReleases],
            'searchKeyword': 'searchKeyword' in filters ? filters['searchKeyword'] : searchKeyword,
        })
    }

    return (
        <>
            <div className={classes.root}>
                {/*<div className="filterLabel">Search by keyword:</div>*/}
                <TextField
                    variant="standard"
                    value={searchKeyword}
                    onChange={(event) => requestSearch(event.target.value)}
                    placeholder="Search by keyword"
                    className={classes.textField}
                    InputProps={{
                        startAdornment: <SearchIcon fontSize="small" />,
                        endAdornment: (
                            <IconButton
                                title="Clear"
                                aria-label="Clear"
                                size="small"
                                style={{ visibility: searchKeyword ? 'visible' : 'hidden' }}
                                onClick={() => requestSearch('')}
                            >
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        ),
                    }}
                />

            </div>

            <Autocomplete
                style={{margin: "0px 0px 20px 5px", width: 500}}
                multiple
                disableCloseOnSelect
                id="tags-standard"
                options={props.releases}
                // getOptionLabel={(option) => option.title}
                onChange={(event, newInputValue) => {
                    setReleases(newInputValue);
                }}
                renderOption={(props, option, { selected }) => (
                    <li {...props}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option}
                    </li>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Releases"
                        placeholder="Releases"
                    />
                )}
            />

            <div className="filterLabel">Patch Category:</div>
            {props.categories.map(function (category) {
                return <StyledButton
                    key={category}
                    color="primary"
                    size="small"
                    variant={selectedCategories.has(category) ? 'contained' : 'outlined'}
                    onClick={() => toggleCategory(category)}
                    disableElevation
                >
                    {category}
                </StyledButton>
            })}
    </>
    );
}

CustomizedToolbar.propTypes = {
    categories: PropTypes.array.isRequired,
    releases: PropTypes.array.isRequired,
    filtersOnChange: PropTypes.func.isRequired
};

export default CustomizedToolbar;