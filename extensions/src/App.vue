
<template>
  <Layout>
    <Header class="header">
      <h1>
        Extension viewer
      </h1>
    </Header>

    <Content class="content">
      <Row type="flex">
        <i-col span="12" offset="6">
          <Row type="flex" :gutter="16">
            <i-col span="12">

              <i-select
                v-model="selectedEntityType"
                placeholder="Entity type"
                @on-change="onEntityTypeChange"
              >
                <i-option
                  v-for="entityType of entityTypes"
                  :value="entityType"
                  :key="entityType"
                >
                  {{ entityType }}
                </i-option>
              </i-select>

            </i-col>
            <i-col span="12">

              <i-select
                placeholder="Extension"
                @on-change="onExtensionChange"
              >
                <i-option
                  v-for="entityExtension of entityExtensions"
                  :value="entityExtension.props.name"
                  :key="entityExtension.props.name"
                >
                  {{ entityExtension.props.name }}
                </i-option>
              </i-select>

            </i-col>
          </Row>
        </i-col>
      </Row>

      <Row type="flex">
        <i-col span="12" offset="6">
          <Card class="params-container">
            <h3 slot="title">Params</h3>
            <div>
              <i-input
                :class="{'border-red': !paramsJsonValid}"
                type="textarea"
                v-model="paramsJsonStr"
                :autosize="true"
                placeholder="Extension parameters in JSON format"
                @on-change="onParamsChange"
              />
            </div>
          </Card>
        </i-col>
      </Row>

      <Card
        class="viewer-container"
        v-if="CurrentExtension && paramsJsonValid"
      >
        <h3 slot="title">Extension</h3>
        <extension-viewer
          class="viewer"
          :Extension="CurrentExtension"
          :ext-params="params"
        />
      </Card>

    </Content>
  </Layout>
</template>


<script>
  import extensions from '@/components/extensions';

  import ExtensionViewer from '@/components/extension-viewer.vue';

  export default {
    name: 'app',
    data() {
      return {
        paramsJsonStr: '{}',
        paramsJsonValid: true,
        params: {},
        selectedEntityType: '',
        entityTypes: extensions.listAvailableEntityTypes(),
        entityExtensions: [],
        CurrentExtension: null,
      };
    },
    components: {
      'extension-viewer': ExtensionViewer,
    },
    methods: {
      onEntityTypeChange(entityType) {
        this.CurrentExtension = null;
        this.entityExtensions = extensions.getByEntityType(entityType);
      },
      onParamsChange() {
        let params;
        try {
          params = JSON.parse(this.paramsJsonStr);
          this.paramsJsonValid = true;
        } catch (error) {
          params = {};
          this.paramsJsonValid = false;
        }

        this.params = params;
      },
      onExtensionChange(extensionName) {
        this.CurrentExtension = this.entityExtensions
          .find(extension => extension.props.name === extensionName);
      },
    },
  };
</script>


<style lang="scss">
  body {
    background-color: #f5f7f9;
  }

  .header {
    color: #f8f8f9;
  }

  .content {
    padding: 2rem;
  }

  .params-container, .viewer-container {
    margin-top: 2rem;
  }

  .border-red .ivu-input {
    border: 1px solid #ed3f14;
    box-shadow: 0 0 0 2px #ed3f1433
  }
</style>
