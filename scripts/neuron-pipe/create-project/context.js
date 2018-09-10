const searchItems = {
  searchCell: {
    "@id": "nxv:SearchCell"
  },
  searchIonChannel: {
    "@id": "nxv:SearchIonChannel"
  },
  searchIonChannelCell: {
    "@id": "nxv:SearchIonChannelCell"
  }
};

export default {
  "@context": [
    {
      nxv: "https://bbp-nexus.epfl.ch/vocabs/nexus/core/terms/v0.1.0/",
      links: {
        "@id": "https://bbp-nexus.epfl.ch/vocabs/nexus/core/terms/v0.1.0/links"
      },
      prov: "http://www.w3.org/ns/prov#",
      generated: {
        "@id": "prov:generated"
      },
      used: {
        "@id": "prov:used"
      },
      qualifiedGeneration: {
        "@id": "prov:qualifiedGeneration"
      },
      wasRevisionOf: {
        "@id": "prov:wasRevisionOf"
      },
      hadMember: {
        "@id": "prov:hadMember"
      },
      wasGeneratedBy: {
        "@id": "prov:wasGeneratedBy"
      },
      wasStartedBy: {
        "@id": "prov:wasStartedBy"
      },
      wasAssociatedWith: {
        "@id": "prov:wasAssociatedWith"
      },
      qualifiedAssociation: {
        "@id": "prov:qualifiedAssociation"
      },
      qualifiedUsage: {
        "@id": "prov:qualifiedUsage"
      },
      hadRole: {
        "@id": "prov:hadRole"
      },
      activity: {
        "@id": "prov:activity"
      },
      hadActivity: {
        "@id": "prov:hadActivity"
      },
      entity: {
        "@id": "prov:entity"
      },
      agent: {
        "@id": "prov:agent"
      },
      Derivation: {
        "@id": "prov:Derivation"
      },
      Generation: {
        "@id": "prov:Generation"
      },
      schema: "http://schema.org/",
      address: {
        "@id": "schema:address"
      },
      PostalAddress: {
        "@id": "schema:PostalAddress"
      },
      parentOrganization: {
        "@type": "@id",
        "@id": "schema:parentOrganization"
      },
      telephone: {
        "@type": "xsd:string",
        "@id": "schema:telephone"
      },
      addressCountry: {
        "@type": "xsd:string",
        "@id": "schema:addressCountry"
      },
      addressLocality: {
        "@type": "xsd:string",
        "@id": "schema:addressLocality"
      },
      postalCode: {
        "@type": "xsd:string",
        "@id": "schema:postalCode"
      },
      streetAddress: {
        "@type": "xsd:string",
        "@id": "schema:streetAddress"
      },
      name: {
        "@type": "xsd:string",
        "@id": "schema:name"
      },
      givenName: {
        "@type": "xsd:string",
        "@id": "schema:givenName"
      },
      familyName: {
        "@id": "schema:familyName",
        "@type": "xsd:string"
      },
      email: {
        "@type": "xsd:string",
        "@id": "schema:email"
      },
      affiliation: {
        "@type": "@id",
        "@id": "schema:affiliation"
      },
      size: {
        "@type": "@id",
        "@id": "schema:size"
      },
      owl: "http://www.w3.org/2002/07/owl#",
      rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      rdfs: "http://www.w3.org/2000/01/rdf-schema#",
      xsd: "http://www.w3.org/2001/XMLSchema#",
      skos: "http://www.w3.org/2004/02/skos/core#",
      prov: "http://www.w3.org/ns/prov#",
      sh: "http://www.w3.org/ns/shacl#",
      shsh: "http://www.w3.org/ns/shacl-shacl#",
      dcterms: "http://purl.org/dc/terms/",
      schema: "http://schema.org/",
      nxv: "https://bbp-nexus.epfl.ch/vocabs/nexus/core/terms/v0.1.0/",
      nsg:
        "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/",
      schema: "http://schema.org/",
      "@vocab":
        "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/",
      nsg:
        "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/",
      schema: "http://schema.org/",
      "@vocab":
        "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/",
      nsg:
        "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/",
      schema: "http://schema.org/",
      dcat: "http://www.w3.org/ns/dcat#",
      ...searchItems,
      ionChannel: {
        "@id": "nxv:ionChannel"
      },
      "1Point": {
        "@id": "nsg:1Point"
      },
      "2DContour": {
        "@id": "nsg:2DContour"
      },
      "3DContour": {
        "@id": "nsg:3DContour"
      },
      "3Point": {
        "@id": "nsg:3Point"
      },
      "@vocab":
        "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/",
      accessURL: {
        "@id": "schema:accessURL",
        "@type": "@id"
      },
      age: {
        "@id": "nsg:age"
      },
      annotationAngle: {
        "@id": "nsg:annotationAngle"
      },
      annotatorComment: {
        "@id": "nsg:annotatorComment"
      },
      apicalDendrite: {
        "@id": "nsg:apicalDendrite"
      },
      atlasVersion: {
        "@id": "nsg:atlasVersion"
      },
      axon: {
        "@id": "nsg:axon"
      },
      axonProjection: {
        "@id": "nsg:axonProjection"
      },
      basalDendrite: {
        "@id": "nsg:basalDendrite"
      },
      birthDate: {
        "@id": "schema:birthDate"
      },
      boundingBox: {
        "@id": "nsg:boundingBox"
      },
      boundingbox: {
        "@id": "nsg:boundingbox"
      },
      brainLocation: {
        "@id": "nsg:brainLocation"
      },
      brainLocationCoordinates: {
        "@id": "nsg:brainLocationCoordinates"
      },
      brainRegion: {
        "@id": "nsg:brainRegion",
        "@type": "@id"
      },
      cellPlacement: {
        "@id": "nsg:cellPlacement",
        "@type": "@id"
      },
      center: {
        "@id": "nsg:center"
      },
      channel: {
        "@id": "nsg:channel"
      },
      circuitCellProperties: {
        "@id": "nsg:circuitCellProperties"
      },
      clusterReconstructionRequested: {
        "@id": "nsg:clusterReconstructionRequested"
      },
      comment: {
        "@id": "nsg:comment"
      },
      compensationCurrent: {
        "@id": "nsg:compensationCurrent"
      },
      configurationUsed: {
        "@id": "nsg:configurationUsed"
      },
      cuttingThickness: {
        "@id": "nsg:cuttingThickness"
      },
      dataUnit: {
        "@id": "nsg:dataUnit"
      },
      dateOfSurgery: {
        "@id": "nsg:dateOfSurgery"
      },
      deathDate: {
        "@id": "schema:deathDate"
      },
      description: {
        "@id": "schema:description"
      },
      digitalToAnalogConverter: {
        "@id": "nsg:digitalToAnalogConverter"
      },
      disease: {
        "@id": "nsg:disease"
      },
      diseaseModel: {
        "@id": "nsg:diseaseModel"
      },
      distanceToBoundary: {
        "@id": "nsg:distanceToBoundary"
      },
      distribution: {
        "@id": "schema:distribution"
      },
      downloadURL: {
        "@id": "schema:downloadURL",
        "@type": "@id"
      },
      eCode: {
        "@id": "nsg:eCode"
      },
      eModel: {
        "@id": "nsg:eModel"
      },
      eType: {
        "@id": "nsg:eType",
        "@type": "@id"
      },
      edgeCollection: {
        "@id": "nsg:edgeCollection"
      },
      edgePopulation: {
        "@id": "nsg:edgePopulation"
      },
      emodelIndex: {
        "@id": "nsg:emodelIndex"
      },
      emodelRelease: {
        "@id": "nsg:emodelRelease"
      },
      endMembranePotential: {
        "@id": "nsg:endMembranePotential"
      },
      experimentalCellList: {
        "@id": "nsg:experimentalCellList"
      },
      experimentalTraceLocation: {
        "@id": "nsg:experimentalTraceLocation"
      },
      featureExtractionConfiguration: {
        "@id": "nsg:featureExtractionConfiguration"
      },
      features: {
        "@id": "nsg:features"
      },
      fixationMethod: {
        "@id": "nsg:fixationMethod"
      },
      geometry: {
        "@id": "nsg:geometry"
      },
      geometryParameter: {
        "@id": "nsg:geometryParameter"
      },
      gpfs: {
        "@id":
          "http://bbp.epfl.ch/neurosciencegraph/taxonomies/storagetypes/gpfs"
      },
      hadProtocol: {
        "@id": "nsg:hadProtocol"
      },
      hasPart: {
        "@id": "dcterms:hasPart"
      },
      heightResolution: {
        "@id": "nsg:heightResolution"
      },
      hemisphere: {
        "@id": "nsg:hemisphere"
      },
      hypampThreshold: {
        "@id": "nsg:hypampThreshold"
      },
      imageDirection: {
        "@id": "nsg:imageDirection"
      },
      imageOrigin: {
        "@id": "nsg:imageOrigin"
      },
      imageVolume: {
        "@id": "nsg:imageVolume"
      },
      inputResistance: {
        "@id": "nsg:inputResistance"
      },
      integrity: {
        "@id": "nsg:integrity"
      },
      isPartOf: {
        "@id": "dcterms:isPartOf",
        "@type": "@id"
      },
      isRegisteredIn: {
        "@id": "nsg:isRegisteredIn"
      },
      label: {
        "@id": "rdfs:label"
      },
      labeledCell: {
        "@id": "nsg:labeledCell"
      },
      labelingCompound: {
        "@id": "nsg:labelingCompound"
      },
      layer: {
        "@id": "nsg:layer"
      },
      liquidJunctionPotential: {
        "@id": "nsg:liquidJunctionPotential"
      },
      location: {
        "@id": "nsg:location"
      },
      longitudinalAxis: {
        "@id": "nsg:longitudinalAxis"
      },
      lowerPoint: {
        "@id": "nsg:lowerPoint"
      },
      mSubType: {
        "@id": "nsg:mSubType"
      },
      mType: {
        "@id": "nsg:mType"
      },
      mainModelScript: {
        "@id": "nsg:mainModelScript"
      },
      masterListConfiguration: {
        "@id": "nsg:masterListConfiguration"
      },
      materials: {
        "@id": "nsg:materials",
        "@type": "@id"
      },
      measuredHoldingPotential: {
        "@id": "nsg:measuredHoldingPotential"
      },
      mediaType: {
        "@id": "schema:mediaType"
      },
      memodelIndex: {
        "@id": "nsg:memodelIndex"
      },
      memodelRelease: {
        "@id": "nsg:memodelRelease",
        "@type": "@id"
      },
      modelOf: {
        "@id": "nsg:modelOf",
        "@type": "@id"
      },
      modelScript: {
        "@id": "nsg:modelScript",
        "@type": "@id"
      },
      morphology: {
        "@id": "nsg:morphology"
      },
      morphologyIndex: {
        "@id": "nsg:morphologyIndex"
      },
      morphologyRelease: {
        "@id": "nsg:morphologyRelease"
      },
      mountingMedia: {
        "@id": "nsg:mountingMedia"
      },
      name: {
        "@id": "schema:name"
      },
      nodeCollection: {
        "@id": "nsg:nodeCollection",
        "@type": "@id"
      },
      normalizedScore: {
        "@id": "nsg:normalizedScore"
      },
      nsg:
        "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/",
      numberOfRepetition: {
        "@id": "nsg:numberOfRepetition"
      },
      numberOfSlices: {
        "@id": "nsg:numberOfSlices"
      },
      objectiveMagnification: {
        "@id": "nsg:objectiveMagnification"
      },
      objectiveType: {
        "@id": "nsg:objectiveType"
      },
      orientation: {
        "@id": "nsg:orientation"
      },
      orientationOfReconstruction: {
        "@id": "nsg:orientationOfReconstruction"
      },
      origin: {
        "@id": "nsg:origin"
      },
      parcellationOntology: {
        "@id": "nsg:parcellationOntology",
        "@type": "@id"
      },
      parcellationVolume: {
        "@id": "nsg:parcellationVolume",
        "@type": "@id"
      },
      period: {
        "@id": "nsg:period"
      },
      pipetteNumber: {
        "@id": "nsg:pipetteNumber"
      },
      pipetteResistance: {
        "@id": "nsg:pipetteResistance"
      },
      positionInLayer: {
        "@id": "nsg:positionInLayer"
      },
      projectName: {
        "@id": "nsg:projectName"
      },
      property: {
        "@id": "nsg:property"
      },
      providerExperimentId: {
        "@id": "nsg:providerExperimentId"
      },
      providerExperimentName: {
        "@id": "nsg:providerExperimentName"
      },
      providerId: {
        "@id": "nsg:providerId"
      },
      putativeEtype: {
        "@id": "nsg:putativeEtype",
        "@type": "@id"
      },
      putativeMType: {
        "@id": "nsg:putativeMType"
      },
      radius: {
        "@id": "nsg:radius"
      },
      reagentLinearFormula: {
        "@id": "nsg:reagentLinearFormula"
      },
      reagentName: {
        "@id": "nsg:reagentName"
      },
      reagentVendor: {
        "@id": "nsg:reagentVendor",
        "@type": "@id"
      },
      reconstructable: {
        "@id": "nsg:reconstructable"
      },
      reconstructionComment: {
        "@id": "nsg:reconstructionComment"
      },
      reconstructionCompleted: {
        "@id": "nsg:reconstructionCompleted"
      },
      reconstructionCompressionCorrected: {
        "@id": "nsg:reconstructionCompressionCorrected"
      },
      reconstructionCorrected: {
        "@id": "nsg:reconstructionCorrected"
      },
      reconstructionDate: {
        "@id": "nsg:reconstructionDate"
      },
      reconstructionLocation: {
        "@id": "nsg:reconstructionLocation"
      },
      reconstructionRequested: {
        "@id": "nsg:reconstructionRequested"
      },
      reconstructionRequester: {
        "@id": "nsg:reconstructionRequester"
      },
      reconstructionSentDate: {
        "@id": "nsg:reconstructionSentDate"
      },
      releaseDate: {
        "@id": "nsg:releaseDate"
      },
      repetition: {
        "@id": "nsg:repetition"
      },
      retrievalDate: {
        "@id": "nsg:retrievalDate"
      },
      schema: "http://schema.org/",
      score: {
        "@id": "nsg:score"
      },
      sealResistance: {
        "@id": "nsg:sealResistance"
      },
      secondRow: {
        "@id": "nsg:secondRow"
      },
      seriesResistance: {
        "@id": "nsg:seriesResistance"
      },
      sex: {
        "@id": "nsg:sex"
      },
      sliceDirection: {
        "@id": "nsg:sliceDirection"
      },
      sliceHeight: {
        "@id": "nsg:sliceHeight"
      },
      sliceInterval: {
        "@id": "nsg:sliceInterval"
      },
      sliceIntervalValue: {
        "@id": "nsg:sliceIntervalValue"
      },
      sliceLocationCoordinates: {
        "@id": "nsg:sliceLocationCoordinates"
      },
      sliceResolution: {
        "@id": "nsg:sliceResolution"
      },
      sliceWidth: {
        "@id": "nsg:sliceWidth"
      },
      slicingAngle: {
        "@id": "nsg:slicingAngle"
      },
      slicingPlane: {
        "@id": "nsg:slicingPlane"
      },
      solution: {
        "@id": "nsg:solution"
      },
      soma: {
        "@id": "nsg:soma"
      },
      somaType: {
        "@id": "nsg:somaType"
      },
      spatialCellName: {
        "@id": "nsg:spatialCellName"
      },
      spatialReferenceSystem: {
        "@id": "nsg:spatialReferenceSystem"
      },
      species: {
        "@id": "nsg:species"
      },
      stain: {
        "@id": "nsg:stain"
      },
      startMembranePotential: {
        "@id": "nsg:startMembranePotential"
      },
      steps: {
        "@id": "nsg:steps"
      },
      stimuliToExperimentMap: {
        "@id": "nsg:stimuliToExperimentMap"
      },
      stimulus: {
        "@id": "nsg:stimulus"
      },
      stimulusType: {
        "@id": "nsg:stimulusType"
      },
      storageType: {
        "@id": "nsg:storageType",
        "@type": "@id"
      },
      strain: {
        "@id": "nsg:strain"
      },
      subCellularMechanism: {
        "@id": "nsg:subCellularMechanism",
        "@type": "@id"
      },
      subRegion: {
        "@id": "nsg:subRegion"
      },
      sweep: {
        "@id": "nsg:sweep"
      },
      synapseRelease: {
        "@id": "nsg:synapseRelease",
        "@type": "@id"
      },
      target: {
        "@id": "nsg:target"
      },
      targetHoldingPotential: {
        "@id": "nsg:targetHoldingPotential"
      },
      thirdRow: {
        "@id": "nsg:thirdRow"
      },
      timeStep: {
        "@id": "nsg:timeStep"
      },
      transgenic: {
        "@id": "nsg:transgenic"
      },
      treatment: {
        "@id": "nsg:treatment"
      },
      unitCode: {
        "@id": "schema:unitCode"
      },
      unitText: {
        "@id": "schema:unitText"
      },
      upperPoint: {
        "@id": "nsg:upperPoint"
      },
      value: {
        "@id": "schema:value"
      },
      valueX: {
        "@id": "nsg:valueX"
      },
      valueY: {
        "@id": "nsg:valueY"
      },
      valueZ: {
        "@id": "nsg:valueZ"
      },
      "valueZ ": {
        "@id": "nsg:valueZ"
      },
      vendor: {
        "@id": "nsg:vendor",
        "@type": "@id"
      },
      version: {
        "@id": "schema:version"
      },
      view2d: {
        "@id": "nsg:view2d"
      },
      view3d: {
        "@id": "nsg:view3d"
      },
      volumeDimension: {
        "@id": "nsg:volumeDimension"
      },
      voxelResolution: {
        "@id": "nsg:voxelResolution"
      },
      voxelResolutionValue: {
        "@id": "nsg:voxelResolutionValue"
      },
      voxelType: {
        "@id": "nsg:voxelType"
      },
      warning: {
        "@id": "nsg:warning"
      },
      wasDerivedFrom: {
        "@id": "prov:wasDerivedFrom"
      },
      waveNumberRange: {
        "@id": "nsg:waveNumberRange"
      },
      weight: {
        "@id": "schema:weight"
      },
      widthResolution: {
        "@id": "nsg:widthResolution"
      }
    }
  ]
};
