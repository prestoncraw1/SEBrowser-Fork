﻿//******************************************************************************************************
//  ReportTimeFilter.tsx - Gbtc
//
//  Copyright © 2020, Grid Protection Alliance.  All Rights Reserved.
//
//  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
//  the NOTICE file distributed with this work for additional information regarding copyright ownership.
//  The GPA licenses this file to you under the MIT License (MIT), the "License"; you may not use this
//  file except in compliance with the License. You may obtain a copy of the License at:
//
//      http://opensource.org/licenses/MIT
//
//  Unless agreed to in writing, the subject software distributed under the License is distributed on an
//  "AS-IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. Refer to the
//  License for the specific language governing permissions and limitations.
//
//  Code Modification History:
//  ----------------------------------------------------------------------------------------------------
//  09/16/2021 - Christoph Lackner
//       Generated original version of source code.
//******************************************************************************************************

import * as React from 'react';
import { SEBrowser } from '../global';
import moment from 'moment';
import { TimePicker, DatePicker, Select, Input } from '@gpa-gemstone/react-forms'
import { useSelector } from 'react-redux';
import { SelectTimeZoneOffset } from './SettingsSlice';

interface IProps {
    filter: SEBrowser.IReportTimeFilter;
    setFilter: (filter: SEBrowser.IReportTimeFilter) => void,
    showQuickSelect: boolean
}

interface IQuickSelect { label: string, createFilter: (offset: number) =>  SEBrowser.IReportTimeFilter }

const momentDateFormat = "MM/DD/YYYY";
const momentTimeFormat = "HH:mm:ss.SSS"; // Also is the gemstone format


const AvailableQuickSelects: IQuickSelect[] = [
    {
        label: 'This Hour', createFilter: (offset) => {
            const t = moment.utc().add(offset, 'hour').startOf('hour');
            t.add(30, 'minutes');
            return {
                date: t.format(momentDateFormat),
                time: t.format(momentTimeFormat),
                timeWindowUnits: 2,
                windowSize: 30
            }
        }
    },
    {
        label: 'Last Hour', createFilter: (offset) => {
            const t = moment.utc().add(offset, 'hour').startOf('hour').subtract(1, 'hour');
            t.add(30, 'minutes')
            return {
                date: t.format(momentDateFormat),
                time: t.format(momentTimeFormat),
                timeWindowUnits: 2,
                windowSize: 30
            }
        }
    },
    {
        label: 'Last 60 Minutes', createFilter: (offset) => {
            const t = moment.utc().add(offset, 'hour').startOf('minute').add(1, 'minute');
            t.subtract(30, 'minutes');
            return {
                date: t.format(momentDateFormat),
                time: t.format(momentTimeFormat),
                timeWindowUnits: 2,
                windowSize: 30
            }
        }
    },
    {
        label: 'Today', createFilter: (offset) => {
            const t = moment.utc().add(offset, 'hour').startOf('day');
            t.add(12, 'hours');
            return {
                date: t.format(momentDateFormat),
                time: t.format(momentTimeFormat),
                timeWindowUnits: 3,
                windowSize: 12
            }
        }
    },
    {
        label: 'Yesterday', createFilter: (offset) => {
            const t = moment.utc().add(offset, 'hour').startOf('day').subtract(1,'days');
            t.add(12, 'hours');
            return {
                date: t.format(momentDateFormat),
                time: t.format(momentTimeFormat),
                timeWindowUnits: 3,
                windowSize: 12
            }
        } },
    {
        label: 'Last 24 Hours', createFilter: (offset) => {
            const t = moment.utc().add(offset, 'hour').startOf('hour').add(1, 'hour');
            t.subtract(12, 'hours');
            return {
                date: t.format(momentDateFormat),
                time: t.format(momentTimeFormat),
                timeWindowUnits: 3,
                windowSize: 12
            }
        }
    },
    {
        label: 'This Week', createFilter: (offset) => {
            const t = moment.utc().add(offset, 'hour').startOf('week');
            t.add(3.5*24, 'hours');
            return {
                date: t.format(momentDateFormat),
                time: t.format(momentTimeFormat),
                timeWindowUnits: 3,
                windowSize: 3.5*24
            }
        }
    },
    {
        label: 'Last Week', createFilter: (offset) => {
            const t = moment.utc().add(offset, 'hour').startOf('week');
            t.subtract(3.5*24, 'hours');
            return {
                date: t.format(momentDateFormat),
                time: t.format(momentTimeFormat),
                timeWindowUnits: 3,
                windowSize: 3.5*24
            }
        }
    },
    {
        label: 'Last 7 Days', createFilter: (offset) => {
            const t = moment.utc().add(offset, 'hour').startOf('day').add(1, 'day');
            t.subtract(3.5*24, 'hours');
            return {
                date: t.format(momentDateFormat),
                time: t.format(momentTimeFormat),
                timeWindowUnits: 3,
                windowSize: 3.5*24
            }
        }
    },
    {
        label: 'This Month', createFilter: (offset) => {
            const t = moment.utc().add(offset, 'hour').startOf('month');
            t.add(12 * t.daysInMonth(), 'hours');
            return {
                date: t.format(momentDateFormat),
                time: t.format(momentTimeFormat),
                timeWindowUnits: 3,
                windowSize: (t.daysInMonth() * 24)/2.0
            }
        }
    },
    {
        label: 'Last Month', createFilter: (offset) => {
            const t = moment.utc().add(offset, 'hour').startOf('month').subtract(1,'month');
            t.add(12 * t.daysInMonth(), 'hours');
            return {
                date: t.format(momentDateFormat),
                time: t.format(momentTimeFormat),
                timeWindowUnits: 3,
                windowSize: (t.daysInMonth() * 24) / 2.0
            }
        }
    },
    {
        label: 'Last 30 Days', createFilter: (offset) => {
            const t = moment.utc().add(offset, 'hour').startOf('day').add(1, 'day');
            t.subtract(15, 'days');
            return {
                date: t.format(momentDateFormat),
                time: t.format(momentTimeFormat),
                timeWindowUnits: 4,
                windowSize: 15
            }
        }
    },
    {
        label: 'This Quarter', createFilter: (offset) => {
            const t = moment.utc().add(offset, 'hour').startOf('quarter');
            const tend = moment.utc().add(offset, 'hour').startOf('quarter');
            tend.add(1, 'quarter')
            const h = moment.duration(tend.diff(t)).asDays();
            t.add(h * 0.5, 'day');
            return {
                date: t.format(momentDateFormat),
                time: t.format(momentTimeFormat),
                timeWindowUnits: 4,
                windowSize: h * 0.5
            }
        }
    },
    {
        label: 'Last Quarter', createFilter: (offset) => {
            const t = moment.utc().add(offset, 'hour').startOf('quarter');
            const tend = moment.utc().add(offset, 'hour').startOf('quarter');
            t.subtract(1, 'quarter');
            const h = moment.duration(tend.diff(t)).asDays();
            t.add(h * 0.5,'day');
            return {
                date: t.format(momentDateFormat),
                time: t.format(momentTimeFormat),
                timeWindowUnits: 4,
                windowSize: h * 0.5
            }
        }
    },
    {
        label: 'Last 90 Days', createFilter: (offset) => {
            const t = moment.utc().add(offset, 'hour').startOf('day').add(1, 'day');
            t.subtract(45, 'days');
            return {
                date: t.format(momentDateFormat),
                time: t.format(momentTimeFormat),
                timeWindowUnits: 4,
                windowSize: 45
            }
        }       
},
    {
        label: 'This Year', createFilter: (offset) => {
            const t = moment.utc().add(offset, 'hour').startOf('year');
            t.add(6, 'month');
            return {
                date: t.format(momentDateFormat),
                time: t.format(momentTimeFormat),
                timeWindowUnits: 6,
                windowSize: 6
            }
        }
    },
    {
        label: 'Last Year', createFilter: (offset) => {
            const t = moment.utc().add(offset, 'hour').startOf('year').subtract(1,'year');
            t.add(6, 'month');
            return {
                date: t.format(momentDateFormat),
                time: t.format(momentTimeFormat),
                timeWindowUnits: 6,
                windowSize: 6
            }
        }
    },
    {
        label: 'Last 365 Days', createFilter: (offset) => {
            const t = moment.utc().add(offset, 'hour').startOf('day').add(1, 'day');
            t.subtract(182.5, 'days');
            return {
                date: t.format(momentDateFormat),
                time: t.format(momentTimeFormat),
                timeWindowUnits: 4,
                windowSize: 182
            }
        }
    }
];


const ReportTimeFilter = (props: IProps) => {
    const [filter, setFilter] = React.useState<SEBrowser.IReportTimeFilter>(props.filter)
    const timeZoneOffset = useSelector(SelectTimeZoneOffset);
    const [activeQP, setActiveQP] = React.useState<number>(-1);

    React.useEffect(() => {
        if (isEqual(props.filter, filter))
            return;
        setFilter(props.filter);
    }, [props.filter])

    React.useEffect(() => {
        if (isEqual(props.filter, filter))
            return;
        props.setFilter(filter);
    }, [filter])

    function isEqual(flt1: SEBrowser.IReportTimeFilter, flt2: SEBrowser.IReportTimeFilter) {
        return flt1.date == flt2.date && flt1.time == flt2.time &&
            flt1.timeWindowUnits == flt2.timeWindowUnits &&
            flt1.windowSize == flt2.windowSize;
    }

    return (
        <fieldset className="border" style={{ padding: '10px', height: '100%' }}>
            <legend className="w-auto" style={{ fontSize: 'large' }}>Date/Time Filter:</legend>
                <div className="">
                    <label style={{ width: '100%', position: 'relative', float: "left" }}>Window Center: </label>
                    <div className="row">
                        <div className='col-6'>
                        <DatePicker<SEBrowser.IReportTimeFilter> Record={filter} Field="date"
                            Setter={(r) => {
                                setFilter(r);
                                setActiveQP(-1);
                            }} Label=''
                            Valid={(record) => { return true; }} Format="MM/DD/YYYY" />
                        </div>
                    <div className='col-6'>
                        <TimePicker<SEBrowser.IReportTimeFilter> Record={filter} Field="time"
                            Setter={(r) => {
                            setFilter(r);
                            setActiveQP(-1);
                            }}
                            Label='' Valid={(record) => { return true; }} Step={0.001} />
                        </div>
                    </div>

                    <label style={{ width: '100%', position: 'relative', float: "left" }}>Time Window(+/-): </label>
                    <div className="row">
                    <div className='col-6'>
                        <Input<SEBrowser.IReportTimeFilter> Record={filter} Field='windowSize' Setter={(r) => {
                            setFilter(r);
                            setActiveQP(-1);
                        }} Label='' Valid={(record) => { return true; }}
                            Type='number' />
                        </div>
                        <div className='col-6'>
                        <Select<SEBrowser.IReportTimeFilter> Record={filter} Label=''
                            Field='timeWindowUnits'
                            Setter={(r) => {
                                setFilter(r);
                                setActiveQP(-1);
                            }}
                                Options={[
                                    { Value: '7', Label: 'Year' },
                                    { Value: '6', Label: 'Month' },
                                    { Value: '5', Label: 'Week' },
                                    { Value: '4', Label: 'Day' },
                                    { Value: '3', Label: 'Hour' },
                                    { Value: '2', Label: 'Minute' },
                                    { Value: '1', Label: 'Second' },
                                    { Value: '0', Label: 'Millisecond' }
                            ]} />
                        </div>
                </div>
            </div>
            {props.showQuickSelect ?
                <div className="row" style={{width: '100%'}}>
                    
                        {AvailableQuickSelects.map((qs, i) => {
                            if (i % 3 !== 0)
                                return null;
                            return (
                                <div key={i} className={"col-3"} style={{ paddingLeft: (i %12 == 0 ? 15 : 0), paddingRight: (i % 12 == 9 ? 15 : 2), marginTop: 10 }}>
                                    <ul className="list-group" key={i}>
                                        <li key={i} style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                props.setFilter(AvailableQuickSelects[i].createFilter(timeZoneOffset));
                                                setActiveQP(i);
                                            }}
                                            className={"item badge badge-" + (i == activeQP? "primary" : "secondary")}>{AvailableQuickSelects[i].label}
                                        </li>
                                        {i + 1 < AvailableQuickSelects.length ?
                                            <li key={i + 1} style={{ marginTop: 3, cursor: 'pointer' }}
                                                className={"item badge badge-" + (i+1 == activeQP ? "primary" : "secondary")}
                                                onClick={() => {
                                                    props.setFilter(AvailableQuickSelects[i + 1].createFilter(timeZoneOffset));
                                                    setActiveQP(i+1)
                                                }}>
                                            {AvailableQuickSelects[i+ 1].label}
                                        </li> : null}
                                        {i + 2 < AvailableQuickSelects.length ?
                                            <li key={i + 2}
                                                style={{ marginTop: 3, cursor: 'pointer' }}
                                                className={"item badge badge-" + (i+2 == activeQP ? "primary" : "secondary")}
                                                onClick={() => {
                                                    props.setFilter(AvailableQuickSelects[i + 2].createFilter(timeZoneOffset));
                                                    setActiveQP(i + 2);
                                                }}>
                                            {AvailableQuickSelects[i+ 2].label}
                                        </li> : null}
                                    </ul>
                                </div>
                            )
                        })}
                </div>
                : null}
        </fieldset>
    );
}
export default ReportTimeFilter;