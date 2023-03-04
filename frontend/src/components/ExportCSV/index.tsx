import React from 'react';
import { CSVLink } from "react-csv";
import { PropTypes, ColumnTypeCSV } from './inerfaces'

const Index: React.FC<PropTypes> = ({
    headers,
    style,
    data,
    documentTitle = `template-${new Date().getTime()}.csv`,
    ...props
}) => {

    const [ columnsCSV, setColumnsCSV ] = React.useState<Array<ColumnTypeCSV>>([]);

    React.useEffect(() => {
        setColumnsCSV(headers);
    }, [headers])

    return (
        <div style={style}>
            <CSVLink
                data={data}
                headers={columnsCSV}
                filename={documentTitle}
                separator={";"}
                onClick={() => { return true; }}
            >
                {props.children}
            </CSVLink>
        </div>
    )
}

export default Index;