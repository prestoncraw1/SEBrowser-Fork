﻿using FaultData.DataAnalysis;
using GSF;
using GSF.Data;
using GSF.Data.Model;
using GSF.Web;
using openXDA.Model;
using SEBrowser.Model.System;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.Caching;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace SEBrowser.Controllers
{
    [RoutePrefix("api/SEBrowser")]
    public class SEBrowserController : ApiController
    {
        #region [ Members ]
        const string SettingsCategory = "systemSettings";
        #endregion

        #region [ Event Search ]
        [Route("GetEventPreviewPaneSettings"), HttpGet]
        public IHttpActionResult GetEventPreviewPaneSettings() {
            try
            {
                using (AdoDataConnection connection = new(SettingsCategory))
                {
                    return Ok(new TableOperations<EventPreviewPaneSetting>(connection).QueryRecords("OrderBy ASC"));
                }
            }
            catch (Exception ex) {
                return InternalServerError(ex);
            }
        }

        [Route("GetLinks/{category}"), HttpGet]
        public IHttpActionResult GetLinks(string category)
        {
            try
            {
                using (AdoDataConnection connection = new(SettingsCategory))
                {
                    return Ok(connection.RetrieveData("SELECT * FROM [SEBrowser.Links] WHERE Name LIKE {0} + '%'", category));
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [Route("GetTimeZone"), HttpGet]
        public IHttpActionResult GetTimeZoneOffset()
        {
            using (AdoDataConnection connection = new AdoDataConnection(SettingsCategory))
            {
                string systemTime = connection.ExecuteScalar<string>("SELECT TOP 1 [Value] FROM [Setting] WHERE Name = 'System.XDATimeZone'");
                if (string.IsNullOrEmpty(systemTime))
                    return Ok(0);
                return Ok(TimeZoneInfo.FindSystemTimeZoneById(systemTime).BaseUtcOffset);
            }
        }
        #endregion

    }

}