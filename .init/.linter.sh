#!/bin/bash
cd /home/kavia/workspace/code-generation/vizai-zoo-monitoring-dashboard-40639-40643/vizai_zoo_monitoring_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

