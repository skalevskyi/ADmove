import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();
const rawDir = path.join(rootDir, 'data', 'trajets', 'raw');
const processedDir = path.join(rootDir, 'data', 'trajets', 'processed');

function extractTagValue(xml, tagName) {
  const match = xml.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return match ? match[1].trim() : '';
}

function parseCoordinates(rawCoordinates) {
  return rawCoordinates
    .split(/\s+/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [lon, lat] = entry.split(',').map(Number);
      if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
        throw new Error(`Invalid coordinate entry: ${entry}`);
      }
      return [lon, lat];
    });
}

function buildFeature(fileName, xml) {
  const name = extractTagValue(xml, 'name') || fileName.replace(/\.kml$/i, '');
  const coordinatesRaw = extractTagValue(xml, 'coordinates');
  if (!coordinatesRaw) {
    throw new Error(`No <coordinates> found in ${fileName}`);
  }

  const coordinates = parseCoordinates(coordinatesRaw);
  return {
    type: 'Feature',
    properties: {
      name,
      source: fileName,
      pointCount: coordinates.length,
      sanitized: false,
      previewOnly: true,
    },
    geometry: {
      type: 'LineString',
      coordinates,
    },
  };
}

await mkdir(processedDir, { recursive: true });

const files = (await readdir(rawDir)).filter((file) => file.toLowerCase().endsWith('.kml')).sort();

if (files.length === 0) {
  throw new Error(`No KML files found in ${rawDir}`);
}

const summary = [];

for (const file of files) {
  const xml = await readFile(path.join(rawDir, file), 'utf8');
  const feature = buildFeature(file, xml);
  const outFile = file.replace(/\.kml$/i, '.geojson');
  await writeFile(path.join(processedDir, outFile), `${JSON.stringify(feature, null, 2)}\n`, 'utf8');
  summary.push({
    file,
    outFile,
    pointCount: feature.properties.pointCount,
    first: feature.geometry.coordinates[0],
    last: feature.geometry.coordinates[feature.geometry.coordinates.length - 1],
  });
}

console.table(summary);
