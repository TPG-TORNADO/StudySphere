-- Migration to fix legacy notifications data for the new navigation system
-- Sets default target mapping for notifications created before the schema update

UPDATE notification 
SET target_type = 'GROUP', target_id = study_group_id 
WHERE target_type IS NULL AND type = 'GROUP_JOIN';

UPDATE notification 
SET target_type = 'DISCUSSION', target_id = target_id, target_parent_id = study_group_id 
WHERE target_type IS NULL AND type = 'POST_REPLY';

UPDATE notification 
SET target_type = 'RESOURCE', target_id = target_id, target_parent_id = study_group_id 
WHERE target_type IS NULL AND type = 'RESOURCE_UPLOAD';

-- Ensure all are non-null if possible (optional verification)
-- SELECT * FROM notification WHERE target_type IS NULL;
