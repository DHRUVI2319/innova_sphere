-- Drop the database if it exists
DROP DATABASE IF EXISTS WaterDistributionSystem;

-- Create the database
CREATE DATABASE WaterDistributionSystem;

-- Use the created database
USE WaterDistributionSystem;

-- Create WaterTreatmentPlants table
CREATE TABLE WaterTreatmentPlants (
    PlantID INT PRIMARY KEY,
    PlantName VARCHAR(100)
);

-- Create DistributionCenters table
CREATE TABLE DistributionCenters (
    CenterID INT PRIMARY KEY,
    CenterName VARCHAR(100)
);

-- Create WaterReservoirs table
CREATE TABLE WaterReservoirs (
    ReservoirID INT PRIMARY KEY,
    ReservoirName VARCHAR(100)
);

-- Create Nodes table
CREATE TABLE Nodes (
    NodeID INT PRIMARY KEY,
    NodeName VARCHAR(100),
    NodeType VARCHAR(50),
    PlantID INT,
    CenterID INT,
    ReservoirID INT,
    CONSTRAINT fk_WaterTreatmentPlants FOREIGN KEY (PlantID) REFERENCES WaterTreatmentPlants(PlantID),
    CONSTRAINT fk_DistributionCenters FOREIGN KEY (CenterID) REFERENCES DistributionCenters(CenterID),
    CONSTRAINT fk_WaterReservoirs FOREIGN KEY (ReservoirID) REFERENCES WaterReservoirs(ReservoirID)
);

-- Create FlowRequirements table
CREATE TABLE FlowRequirements (
    RequirementID INT PRIMARY KEY,
    NodeID INT,
    RequiredFlow INT,
    CONSTRAINT fk_Nodes FOREIGN KEY (NodeID) REFERENCES Nodes(NodeID)
);

-- Create ActualFlowRates table
CREATE TABLE ActualFlowRates (
    FlowRateID INT PRIMARY KEY,
    NodeID INT,
    ActualFlow INT,
    DateRecorded DATETIME,
    CONSTRAINT fk_Nodes_Actual FOREIGN KEY (NodeID) REFERENCES Nodes(NodeID)
);

-- Create Issues table
CREATE TABLE Issues (
    IssueID INT PRIMARY KEY,
    NodeID INT,
    IssueType VARCHAR(50),
    IssueDescription TEXT,
    IssueSeverity VARCHAR(50),
    DateReported DATETIME,
    CONSTRAINT fk_Nodes_Issues FOREIGN KEY (NodeID) REFERENCES Nodes(NodeID)
);

-- Insert data into WaterTreatmentPlants
INSERT INTO WaterTreatmentPlants (PlantID, PlantName) VALUES
(1, 'Water Treatment Plant A'),
(2, 'Water Treatment Plant B');

-- Insert data into DistributionCenters
INSERT INTO DistributionCenters (CenterID, CenterName) VALUES
(1, 'Water Distribution Center C');

-- Insert data into WaterReservoirs
INSERT INTO WaterReservoirs (ReservoirID, ReservoirName) VALUES
(1, 'Water Reservoir D');

-- Insert data into Nodes
INSERT INTO Nodes (NodeID, NodeName, NodeType, PlantID, CenterID, ReservoirID) VALUES
(1, 'Downtown', 'Water Treatment Plant', 1, NULL, NULL),
(2, 'North Indore', 'Water Treatment Plant', 1, NULL, NULL),
(3, 'Industrial Area', 'Water Treatment Plant', 1, NULL, NULL),
(4, 'South Indore', 'Water Treatment Plant', 2, NULL, NULL),
(5, 'East Indore', 'Water Treatment Plant', 2, NULL, NULL),
(6, 'Residential Zone', 'Water Treatment Plant', 2, NULL, NULL),
(7, 'Western Indore', 'Distribution Center', NULL, 1, NULL),
(8, 'University Area', 'Distribution Center', NULL, 1, NULL),
(9, 'Commercial District', 'Distribution Center', NULL, 1, NULL),
(10, 'Central Business District', 'Reservoir', NULL, NULL, 1),
(11, 'Suburban Areas', 'Reservoir', NULL, NULL, 1),
(12, 'City Outskirts', 'Reservoir', NULL, NULL, 1);

-- Insert data into FlowRequirements
INSERT INTO FlowRequirements (RequirementID, NodeID, RequiredFlow) VALUES
(1, 1, 2000),
(2, 2, 1500),
(3, 3, 2500),
(4, 4, 1800),
(5, 5, 1600),
(6, 6, 2200),
(7, 7, 1700),
(8, 8, 1400),
(9, 9, 2000),
(10, 10, 1900),
(11, 11, 1600),
(12, 12, 1500);

-- Insert data into ActualFlowRates
INSERT INTO ActualFlowRates (FlowRateID, NodeID, ActualFlow, DateRecorded) VALUES
(1, 1, 1600, '2024-07-01 10:00:00'),
(2, 2, 1500, '2024-07-01 10:00:00'),
(3, 3, 2600, '2024-07-01 10:00:00'),
(4, 4, 1700, '2024-07-01 10:00:00'),
(5, 5, 1550, '2024-07-01 10:00:00'),
(6, 6, 2200, '2024-07-01 10:00:00'),
(7, 7, 1600, '2024-07-01 10:00:00'),
(8, 8, 1550, '2024-07-01 10:00:00'),
(9, 9, 2000, '2024-07-01 10:00:00'),
(10, 10, 1900, '2024-07-01 10:00:00'),
(11, 11, 1450, '2024-07-01 10:00:00'),
(12, 12, 1500, '2024-07-01 10:00:00');
