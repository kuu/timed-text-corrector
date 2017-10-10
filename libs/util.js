function hasOwnProp(obj, propName) {
  return Object.hasOwnProperty.call(obj, propName);
}

function safePropAccess(obj, nestedPropName) {
  if (!nestedPropName) {
    return undefined;
  }
  const propList = nestedPropName.split('.');
  return propList.reduce((o, prop) => {
    if (!o || !hasOwnProp(o, prop)) {
      return undefined;
    }
    return o[prop];
  }, obj);
}

function formalizeTranscript(str) {
  if (!str || typeof str !== 'string') {
    return [];
  }
  // Split normal english text
  return str.replace(/([.?!])\s*(?=[A-Z])/g, '$1^').split('^');
}

function formalizeTimedText(data) {
  return data;
}

function THROW(err) {
  throw err;
}

function THROW_INVALID_FORMAT(msg) {
  THROW(new TypeError(`Invalid data format: ${msg}`));
}

function formatAzureVideoIndexer(srcData, language) {
  const srcBreakdownList = safePropAccess(srcData, 'breakdowns');
  if (!srcBreakdownList || !Array.isArray(srcBreakdownList)) {
    THROW_INVALID_FORMAT('Azure Video Indexer');
  }
  const destLines = [];
  for (const srcBreakdown of srcBreakdownList) {
    const srcLines = safePropAccess(srcBreakdown, 'insights.transcriptBlocks');
    if (!srcLines || !Array.isArray(srcLines)) {
      THROW_INVALID_FORMAT('Azure Video Indexer');
    }
    for (const {lines} of srcLines) {
      if (!lines || !lines.length) {
        continue;
      }
      for (const srcObj of lines) {
        const timeRange = srcObj.timeRange || srcObj.adjustedTimeRange;
        if (!timeRange || !timeRange.start || !timeRange.end) {
          continue;
        }
        destLines.push({
          start: timeRange.start,
          end: timeRange.end,
          text: srcObj.text
        });
      }
    }
  }
  const destObj = {
    languages: {}
  };
  destObj.languages[language] = {
    lines: destLines
  };
  return destObj;
}

module.exports = {
  hasOwnProp,
  safePropAccess,
  formalizeTranscript,
  formalizeTimedText,
  formatAzureVideoIndexer
};
