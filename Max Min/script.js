const results = extrema
  .map(e => '${e.type}: (${e.x.toFixed(2)}, ${e.y.toFixed(2)})')
  .join('<br>');

document.getElementById('results').innerHTML = '<b>Results:</b><br>${results}';